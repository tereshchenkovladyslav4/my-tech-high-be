import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, getConnection, Repository } from 'typeorm';
import { Address } from '../../models/address.entity';
import { PersonAddress } from '../../models/person-address.entity';
import { Person } from '../../models/person.entity';
import { Phone } from '../../models/phone.entity';
import { User } from '../../models/user.entity';
import { PersonInfo } from '../../models/person-info';
import { CreateUserInput } from './../dto/create-user.input';
import { UpdateProfileInput } from './../dto/update-profile.inputs';
import { UpdateAccountInput } from '../dto/update-account.inputs';
import { UpdateUserInput } from './../dto/update-user.input';
import * as Moment from 'moment';
import { EmailsService } from 'src/users/services/emails.service';
import { EmailVerifierService } from './email-verifier.service';
import { GetPersonInfoArgs } from '../dto/get-person-info.args';
const crypto = require('crypto');
const salt = process.env.MTH_SALT || 'asin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private emailService: EmailsService,
    private emailVerifierService: EmailVerifierService,
  ) {}

  saltPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex');
  }

  async validateCreator(id: number): Promise<Boolean> {
    // const user = this.usersRepository.createQueryBuilder("user").leftJoinAndSelect("user.user_id", "level")
    //   .where("level.user_id = :user_id", { id })
    const user = await this.usersRepository.findOne({
      where: {
        user_id: id,
        level: 1,
      },
    });
    if (user) return true;
    return false;
  }

  async findAllPersonInfoBySearchItem(
    getPersonInfoArgs: GetPersonInfoArgs,
  ): Promise<PersonInfo[]> {
    console.log('findAllPersonInfoBySearchItem service start');
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const response = (await queryRunner.query(
        `SELECT
            t1.id,
            t1.parentId,
            t1.name,
            t1.role,
            t1.email,
            t1.phoneNumber
          FROM (
            SELECT
              student.student_id AS id,
              student.parent_id AS parentId,
              CONCAT(person.first_name, ' ', person.last_name) AS name,
              person.email AS email,
              phone.number AS phoneNumber,
              'Student' AS role
            FROM 
            (
              SELECT * FROM infocenter.mth_student
            ) AS student
            LEFT JOIN infocenter.mth_person AS person ON (person.person_id = student.person_id)
            LEFT JOIN infocenter.user_region AS region ON (region.user_id = person.user_id)
            LEFT JOIN infocenter.mth_phone AS phone ON (phone.person_id = person.person_id)
            WHERE
              region.region_id IS NOT NULL AND 
              region.region_id = ${getPersonInfoArgs.region_id} AND (
                CONCAT(person.first_name, ' ', person.last_name) LIKE '%${getPersonInfoArgs.search}%' OR
                person.email LIKE '%${getPersonInfoArgs.search}%' OR
                phone.number LIKE '%${getPersonInfoArgs.search}%'
              )
            UNION
            SELECT
              parent.parent_id AS id,
              '' AS parentId,
              CONCAT(person.first_name, ' ', person.last_name) AS name,
              person.email AS email,
              phone.number AS phoneNumber,
              'Parent' AS role
            FROM 
            (
              SELECT * FROM infocenter.mth_parent
            ) AS parent
            LEFT JOIN infocenter.mth_person AS person ON (person.person_id = parent.person_id) 
            LEFT JOIN infocenter.user_region AS region ON (region.user_id = person.user_id)
            LEFT JOIN infocenter.mth_phone AS phone ON (phone.person_id = person.person_id)
            WHERE
              region.region_id IS NOT NULL AND 
              region.region_id = ${getPersonInfoArgs.region_id} AND (
                CONCAT(person.first_name, ' ', person.last_name) LIKE '%${getPersonInfoArgs.search}%' OR
                person.email LIKE '%${getPersonInfoArgs.search}%' OR
                phone.number LIKE '%${getPersonInfoArgs.search}%'
              )
          ) AS t1
          ORDER BY t1.name     
          limit 0, 10  
        `,
      )) as PersonInfo[];
      await queryRunner.release();
      return response;
    } catch (err) {
      return err;
    }
  }

  async findAll(): Promise<User[]> {
    const data = await this.usersRepository.find({
      relations: [
        'role',
        'userRegion',
        'userRegion.regionDetail',
        'userAccess',
        'userAccess.accessDetail',
        'student',
        'student.studentDetail',
      ],
    });
    return data;
  }

  async findOneById(user_id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        user_id: user_id,
      },
      relations: [
        'role',
        'userRegion',
        'userRegion.regionDetail',
        'userAccess',
        'userAccess.accessDetail',
        'student',
        'student.studentDetail',
      ],
    });
  }

  async findUsersByRegions(regions: [number]): Promise<User[]> {
    if (regions.length > 0) {
      const response = await User.createQueryBuilder('users')
        .innerJoinAndSelect('users.userRegion', 'userRegion')
        .innerJoinAndSelect('users.role', 'role')
        .where('userRegion.region_id IN (:region_id)', { region_id: regions })
        .getMany();

      return response;
    } else {
      return [];
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
        status: 1,
      },
      relations: [
        'profile',
        'role',
        'userRegion',
        'userRegion.regionDetail',
        'userAccess',
        'userAccess.accessDetail',
        'student',
        'student.studentDetail',
      ],
    });
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    const isExist = await this.findOneByEmail(createUserInput.email);
    if (isExist) {
      throw new BadRequestException(
        'An account with this email address already exist!',
      );
    } else {
      const payload = {
        email: createUserInput.email,
        first_name: createUserInput.first_name,
        last_name: createUserInput.last_name,
        password: this.saltPassword('password'),
        level: createUserInput.level,
        status: '0',
      };

      const data = this.usersRepository.create(payload);
      const user = await this.usersRepository.save(data);
      if (user) {
        const emailVerifier = await this.emailVerifierService.create({
          user_id: user.user_id,
          email: user.email,
          verification_type: 0,
        });

        if (!emailVerifier)
          throw new HttpException(
            'EmailVerifier Not Created',
            HttpStatus.CONFLICT,
          );
        console.log('EmailVerifier: ', emailVerifier);

        await this.emailService.sendAccountVerificationEmail(emailVerifier);

        return user;
      } else {
        throw new HttpException(
          'There was an error creating user, Try Again!',
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const record = await this.findOneById(updateUserInput.user_id);
    if (!record) {
      throw new HttpException(
        'This account has been removed.',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = await this.usersRepository.update(
        updateUserInput.user_id,
        updateUserInput,
      );
      if (user.affected > 0) {
        return await this.usersRepository.findOne(updateUserInput.user_id);
      } else {
        throw new HttpException(
          'There was an error updating user, Try Again!',
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  async changeUserStatus(user_id: number, status: string): Promise<User> {
    const data = await this.usersRepository.update(user_id, { status: status });
    if (data.affected > 0) {
      return await this.findOneById(user_id);
    } else {
      throw new HttpException(
        'No record updated, Try again!',
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  async getProfile(user_id: number): Promise<Person> {
    return await createQueryBuilder(Person)
      .innerJoin(User, 'user', 'user.user_id = `Person`.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getOne();
  }

  async updateProfile(
    user: User,
    updateProfileInput: UpdateProfileInput,
  ): Promise<User> {
    const person = await createQueryBuilder(Person)
      .innerJoin(User, 'user', 'user.user_id = `Person`.user_id')
      .where('user.user_id = :userId', { userId: user.user_id })
      .printSql()
      .getOne();

    // Update Person Data
    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set({
        first_name: updateProfileInput.first_name,
        last_name: updateProfileInput.last_name,
        middle_name: updateProfileInput.middle_name,
        preferred_first_name: updateProfileInput.preferred_first_name,
        preferred_last_name: updateProfileInput.preferred_last_name,
        email: updateProfileInput.email,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    // Update Phone
    await getConnection()
      .createQueryBuilder()
      .update(Phone)
      .set({
        number: updateProfileInput.phone_number,
        recieve_text: updateProfileInput.recieve_text,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    // Update Address
    const hasAddress = await createQueryBuilder(PersonAddress)
      .innerJoin(
        Person,
        'person',
        'person.person_id = `PersonAddress`.person_id',
      )
      .where('`PersonAddress`.person_id = :id', { id: person.person_id })
      .printSql()
      .getOne();

    console.log('HasAddress: ', hasAddress);
    if (!hasAddress) {
      const address = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Address)
        .values([
          {
            name: 'Home',
            street: updateProfileInput.address_1,
            street2: updateProfileInput.address_2 || '',
            city: updateProfileInput.city,
            state: updateProfileInput.state,
            zip: updateProfileInput.zipcode,
          },
        ])
        .execute();

      console.log('Address: ', address);
      const address_id = address.raw && address.raw.insertId;
      if (address_id) {
        console.log('Address ID: ', address_id);
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(PersonAddress)
          .values([
            {
              person_id: person.person_id,
              address_id: address_id,
            },
          ])
          .execute();
      }
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(Address)
        .set({
          street: updateProfileInput.address_1,
          street2: updateProfileInput.address_2 || '',
          city: updateProfileInput.city,
          state: updateProfileInput.state,
          zip: updateProfileInput.zipcode,
        })
        .where('address_id = :id', { id: hasAddress.address_id })
        .execute();
    }

    return user;
  }

  async updateAccount(user: User, updateAccountInput: UpdateAccountInput) {
    const { password, confirm_password, current_password } = updateAccountInput;

    if (!user.password.match(this.saltPassword(current_password)))
      throw new BadRequestException('Current password is not correct.');

    let pattern = new RegExp('^(?=(.*[a-zA-Z]){1,})(?=(.*[0-9]){2,}).{8,}$'); //Regex: At least 8 characters with at least 2 numericals
    if (!pattern.test(password))
      throw new BadRequestException(
        'At least 8 characters with at least 2 numericals.',
      );

    if (!password.match(confirm_password))
      throw new BadRequestException(
        'The password and confirmation password do not match.',
      );

    if (user.password.match(this.saltPassword(password)))
      throw new BadRequestException(
        'The new password should be different from the current password.',
      );

    const updated_at = Moment().format('YYYY-MM-DD HH:mm:ss');

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: this.saltPassword(password), updated_at })
      .where('user_id = :id', { id: user.user_id })
      .execute();

    return user;
  }

  async removeProfilePhoto(user: User): Promise<User> {
    const updated_at = Moment().format('YYYY-MM-DD HH:mm:ss');
    return this.usersRepository.save({
      ...user,
      avatar_url: null,
      updated_at,
    });
  }
}
