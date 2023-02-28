import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, createQueryBuilder, getConnection, Repository } from 'typeorm';
import { Address } from '../../models/address.entity';
import { PersonAddress } from '../../models/person-address.entity';
import { Person } from '../../models/person.entity';
import { Phone } from '../../models/phone.entity';
import { User } from '../../models/user.entity';
import { PersonInfo } from '../../models/person-info';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateProfileInput } from '../dto/update-profile.inputs';
import { UpdateAccountInput } from '../dto/update-account.inputs';
import { UpdateUserInput } from '../dto/update-user.input';
import * as Moment from 'moment';
import { EmailsService } from 'src/users/services/emails.service';
import { EmailVerifierService } from './email-verifier.service';
import { GetPersonInfoArgs } from '../dto/get-person-info.args';
import { UserRegionArgs } from '../dto/user-regions.args';
import { UserRegionService } from './region/user-region.service';
import { Pagination } from '../paginate';
import { MasqueradeInput } from '../dto/masquerade-input';
import * as crypto from 'crypto';
const salt = process.env.MTH_SALT || 'asin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private emailService: EmailsService,
    private emailVerifierService: EmailVerifierService,
    private userRegionService: UserRegionService,
  ) {}

  saltPassword(password: string) {
    return crypto.createHash('md5').update(`${password}${salt}`).digest('hex');
  }

  async validateCreator(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { user_id: id, level: 1 },
    });
    return !!user;
  }

  async findAllPersonInfoBySearchItem(getPersonInfoArgs: GetPersonInfoArgs): Promise<PersonInfo[]> {
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
              parent.parent_id AS parentId,
              CONCAT(person.last_name, ', ', person.first_name) AS name,
              person.email AS email,
              phone.number AS phoneNumber,
              'Student' AS role
            FROM
            (
              SELECT * FROM infocenter.mth_application
            ) AS applications
            LEFT JOIN infocenter.mth_student student ON (student.student_id = applications.student_id)
            LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
            LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
            LEFT JOIN infocenter.mth_phone phone ON (phone.person_id = person.person_id)
            LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = applications.school_year_id)
            WHERE
              schoolYear.RegionId = ${getPersonInfoArgs.region_id} AND
              (
                CONCAT(person.last_name, ', ', person.first_name) LIKE '%${getPersonInfoArgs.search}%' OR
                person.preferred_last_name LIKE '%${getPersonInfoArgs.search}%' OR
                person.preferred_first_name LIKE '%${getPersonInfoArgs.search}%'OR
                person.email LIKE '%${getPersonInfoArgs.search}%' OR
                phone.number LIKE '%${getPersonInfoArgs.search}%'
              )
            UNION
            SELECT
              parent.parent_id AS id,
              '' AS parentId,
              CONCAT(person.last_name, ', ', person.first_name) AS name,
              person.email AS email,
              phone.number AS phoneNumber,
              'Parent' AS role
            FROM
            (
              SELECT * FROM infocenter.mth_application
            ) AS applications
            LEFT JOIN infocenter.mth_student student ON (student.student_id = applications.student_id)
            LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
            LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
            LEFT JOIN infocenter.mth_phone phone ON (phone.person_id = person.person_id)
            LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = applications.school_year_id)
            WHERE
              schoolYear.RegionId = ${getPersonInfoArgs.region_id} AND
              (
                CONCAT(person.last_name, ', ', person.first_name) LIKE '%${getPersonInfoArgs.search}%' OR
                person.preferred_last_name LIKE '%${getPersonInfoArgs.search}%' OR
                person.preferred_first_name LIKE '%${getPersonInfoArgs.search}%'OR
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
    return await this.usersRepository.find({
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

  async findUsersByRegions(userRegionArgs: UserRegionArgs): Promise<Pagination<User>> {
    const { skip, take, sort, filters, search, region_id } = userRegionArgs;
    const _sortBy = sort.split('|');
    if (filters.length === 0) {
      return new Pagination<User>({
        results: [],
        total: 0,
      });
    }

    let qb = this.usersRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.userRegion', 'userRegion')
      .innerJoinAndSelect('users.role', 'role')
      .where('userRegion.region_id IN (:region_id)', { region_id: region_id })
      .andWhere('role.name IN (:name)', { name: filters });

    if (filters.includes('Inactive')) {
      qb = qb.andWhere('users.status = 0');
    } else {
      qb = qb.andWhere('users.status <> 0');
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('users.first_name like :text', { text: `%${search}%` });
          sub.orWhere('users.last_name like :text', { text: `%${search}%` });
          sub.orWhere('users.email like :text', { text: `%${search}%` });
        }),
      );
    }

    if (sort) {
      if (_sortBy[1].toLocaleLowerCase() === 'desc') {
        if (_sortBy[0] === 'user_id') {
          qb.orderBy('users.user_id', 'DESC');
        } else if (_sortBy[0] == 'first_name') {
          qb.orderBy('users.first_name', 'DESC');
        } else if (_sortBy[0] == 'email') {
          qb.orderBy('users.email', 'DESC');
        } else if (_sortBy[0] == 'level') {
          qb.orderBy('users.level', 'DESC');
        } else if (_sortBy[0] == 'last_login') {
          qb.orderBy('users.last_login', 'DESC');
        } else if (_sortBy[0] == 'status') {
          qb.orderBy('users.status', 'DESC');
        } else if (_sortBy[0] == 'can_emulate') {
          qb.orderBy('users.can_emulate', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'user_id') {
          qb.orderBy('users.user_id', 'ASC');
        } else if (_sortBy[0] == 'first_name') {
          qb.orderBy('users.first_name', 'ASC');
        } else if (_sortBy[0] == 'email') {
          qb.orderBy('users.email', 'ASC');
        } else if (_sortBy[0] == 'level') {
          qb.orderBy('users.level', 'ASC');
        } else if (_sortBy[0] == 'last_login') {
          qb.orderBy('users.last_login', 'ASC');
        } else if (_sortBy[0] == 'status') {
          qb.orderBy('users.status', 'ASC');
        } else if (_sortBy[0] == 'can_emulate') {
          qb.orderBy('users.can_emulate', 'ASC');
        }
      }
    }

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();
    return new Pagination<User>({
      results,
      total,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email,
        status: 1,
      },
    });

    if (!user) return user;

    const queryRunner = await getConnection().createQueryRunner();
    try {
      const response = (await queryRunner.query(
        `SELECT person_id, first_name, last_name, middle_name, preferred_first_name, preferred_last_name, gender, email, date_of_birth, user_id FROM infocenter.mth_person WHERE user_id = ${user.user_id}`,
      )) as Person[];

      if (response.length == 0) {
        await queryRunner.query(
          `INSERT INTO infocenter.mth_person (person_id, first_name, last_name, middle_name, preferred_first_name, preferred_last_name, gender, email, date_of_birth, user_id)
          VALUES (0, '${user.first_name}', '${user.last_name}', '', '', '', 'Male', '${user.email}', NOW(), ${user.user_id});`,
        );
      }
    } catch (error) {
      return error;
    } finally {
      await queryRunner.release();
    }

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
      throw new BadRequestException('An account with this email address already exist!');
    } else {
      const payload = {
        email: createUserInput.email,
        first_name: createUserInput.first_name,
        last_name: createUserInput.last_name,
        password: this.saltPassword('password'),
        level: createUserInput.level,
        status: '0',
        masquerade: createUserInput.level === 1 ? 1 : 0,
      };

      const data = this.usersRepository.create(payload);
      const user = await this.usersRepository.save(data);
      if (user) {
        const regionPayload = {
          user_id: user.user_id,
          region_id: createUserInput.regions,
          creator_id: createUserInput.creator_id,
        };
        await this.userRegionService.createUserRegion(regionPayload);

        await this.emailVerifierService.delete({ email: user.email });
        const emailVerifier = await this.emailVerifierService.create({
          user_id: user.user_id,
          email: user.email,
          verification_type: 0,
        });
        if (!emailVerifier) throw new HttpException('EmailVerifier Not Created', HttpStatus.CONFLICT);

        await this.emailService.sendAccountVerificationEmail(emailVerifier);
        return user;
      } else {
        throw new HttpException('There was an error creating user, Try Again!', HttpStatus.CONFLICT);
      }
    }
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<User> {
    const record = await this.findOneById(updateUserInput.user_id);
    if (!record) {
      throw new HttpException('This account has been removed.', HttpStatus.BAD_REQUEST);
    } else {
      const user = await this.usersRepository.update(updateUserInput.user_id, updateUserInput);
      if (user.affected > 0) {
        return await this.usersRepository.findOne(updateUserInput.user_id);
      } else {
        throw new HttpException('There was an error updating user, Try Again!', HttpStatus.CONFLICT);
      }
    }
  }

  async changeUserStatus(user_id: number, status: string): Promise<User> {
    const data = await this.usersRepository.update(user_id, { status: status });
    if (data.affected > 0) {
      return await this.findOneById(user_id);
    } else {
      throw new HttpException('No record updated, Try again!', HttpStatus.NOT_MODIFIED);
    }
  }

  async updateProfile(user: User, updateProfileInput: UpdateProfileInput): Promise<User> {
    const anotherPerson = await createQueryBuilder(Person)
      .where('email = :email AND user_id != :userId', {
        email: updateProfileInput.email,
        userId: user.user_id,
      })
      .getOne();
    if (anotherPerson) {
      throw new BadRequestException('Email is already in use. Please choose another one.');
    }

    const person = await createQueryBuilder(Person)
      .innerJoin(User, 'user', 'user.user_id = `Person`.user_id')
      .where('user.user_id = :userId', { userId: user.user_id })
      .printSql()
      .getOne();

    //  Update core user
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        email: updateProfileInput.email,
        avatar_url: updateProfileInput.avatar_url,
      })
      .where('user_id = :id', { id: user.user_id })
      .execute();

    // Check if the current user exists in person table
    if (!person) {
      return user;
    }

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

    // update email
    if (person.email !== updateProfileInput.email) {
      await this.emailVerifierService.delete({
        email: updateProfileInput.email,
      });
      const emailVerifier = await this.emailVerifierService.create({
        user_id: user.user_id,
        email: updateProfileInput.email,
        verification_type: 0,
      });

      if (!emailVerifier) throw new HttpException('EmailVerifier Not Created', HttpStatus.CONFLICT);
      await this.emailService.sendEmailUpdateVerificationEmail(emailVerifier);
    }

    // Update Phone
    const queryRunner = await getConnection().createQueryRunner();
    const response = await queryRunner.query(
      `SELECT COUNT(*) as count
        FROM infocenter.mth_phone
        WHERE 
          person_id = ${person.person_id}
      `,
    );
    let count = 0;
    response.map((item) => {
      count = item.count;
    });
    if (count == 0) {
      await queryRunner.query(
        `INSERT INTO infocenter.mth_phone (person_id, number, recieve_text)
          VALUES (${person.person_id} , ${updateProfileInput.phone_number}, ${updateProfileInput.recieve_text})
        `,
      );
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(Phone)
        .set({
          number: updateProfileInput.phone_number,
          recieve_text: updateProfileInput.recieve_text,
        })
        .where('person_id = :id', { id: person.person_id })
        .execute();
    }
    await queryRunner.release();

    // Update Address
    const hasAddress = await createQueryBuilder(PersonAddress)
      .innerJoin(Person, 'person', 'person.person_id = `PersonAddress`.person_id')
      .where('`PersonAddress`.person_id = :id', { id: person.person_id })
      .printSql()
      .getOne();

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
            county_id: updateProfileInput.county_id,
            country_id: updateProfileInput.country_id,
          },
        ])
        .execute();

      const address_id = address.raw && address.raw.insertId;
      if (address_id) {
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
          county_id: updateProfileInput.county_id,
          country_id: updateProfileInput.country_id,
        })
        .where('address_id = :id', { id: hasAddress.address_id })
        .execute();
    }

    return user;
  }

  async updateAccount(user: User, updateAccountInput: UpdateAccountInput): Promise<User> {
    const { oldpassword, password } = updateAccountInput;
    const pattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    if (!pattern.test(password))
      throw new BadRequestException(
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      );

    if (user.level == 1 && !user.password.match(this.saltPassword(oldpassword)))
      throw new BadRequestException('Please enter the correct password.');

    if (user.password.match(this.saltPassword(password)))
      throw new BadRequestException('The new password should be different from the current password.');

    const updated_at = Moment().format('YYYY-MM-DD HH:mm:ss');

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: this.saltPassword(password), updated_at })
      .where('user_id = :id', { id: user.user_id })
      .execute();

    return user;
  }

  async toggleMasquerade(user: User, masqueradeInput: MasqueradeInput): Promise<User> {
    const { user_id, masquerade } = masqueradeInput;

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ masquerade: masquerade ? 1 : 0 })
      .where('user_id = :id', { id: user_id })
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

  async getTeachersBySearch(searchPrimaryTeacher: GetPersonInfoArgs): Promise<User[]> {
    const { region_id, search } = searchPrimaryTeacher;

    const qb = this.usersRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.userRegion', 'userRegion')
      .where('userRegion.region_id = :region_id', { region_id: region_id })
      .andWhere('users.level = 16')
      .andWhere('users.status = 1');

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('users.first_name like :text', { text: `%${search}%` });
          sub.orWhere('users.last_name like :text', { text: `%${search}%` });
        }),
      );
    }

    const [results] = await qb.getManyAndCount();
    return results;
  }
}
