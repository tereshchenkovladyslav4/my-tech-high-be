import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../models/student.entity';
import { Person } from '../models/person.entity';
import { Observer } from '../models/observer.entity';
import { ObserverInput } from '../dto/observer.inputs';
import { UsersService } from './users.service';
import { PersonsService } from './persons.service';
import { EmailVerifierService } from './email-verifier.service';
import { EmailsService } from './emails.service';
import { UserRegionService } from './user-region.service';

@Injectable()
export class ObserversService {
  constructor(
    @InjectRepository(Observer)
    private readonly observersRepository: Repository<Observer>,
    private usersService: UsersService,
    private personsService: PersonsService,
    private emailVerifierService: EmailVerifierService,
    private emailsService: EmailsService,
    private userRegionService: UserRegionService,
  ) {}

  generatePassword() {
    const characterList = 'mthv2@2022';
    let password = '';
    const characterListLength = characterList.length;

    for (let i = 0; i < 8; i++) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      password = password + characterList.charAt(characterIndex);
    }
    return password;
  }

  async findOneById(observer_id: number): Promise<Observer> {
    return this.observersRepository.findOne(observer_id);
  }

  async findOneByParent(parent_id: number): Promise<Observer[]> {
    return await this.observersRepository
      .createQueryBuilder('observer')
      .leftJoin(Person, 'person', 'person.person_id = observer.person_id')
      .where('observer.parent_id = :parent_id', { parent_id: parent_id })
      .getMany();
  }

  async create(observerInput: ObserverInput): Promise<Observer[]> {
    const { student_ids, parent_id, first_name, last_name, email, regions } = observerInput;
    const hasUser = await this.usersService.findOneByEmail(email);
    if (hasUser) throw new ServiceUnavailableException('Email Already Exist!');

    const person = await this.personsService.create({
      first_name,
      last_name,
      email,
    });
    if (!person) throw new ServiceUnavailableException('Person Not Created');

    const { person_id } = person;

    const password = this.generatePassword();
    const user = await this.usersService.create({
      firstName: first_name,
      lastName: last_name,
      email: email,
      level: 14,
      updateAt: new Date().toString(),
      password,
    });

    if (!user) throw new ServiceUnavailableException('User Not Created');
    console.log('regions-------------------', regions);
    const { user_id } = user;
    if (regions) {
      const regionPayload = {
        user_id: user_id,
        region_id: regions,
      };
      await this.userRegionService.createUserRegion(regionPayload);
    }
    const updatedPerson = await this.personsService.updateUserId({
      person_id,
      user_id,
    });

    if (!updatedPerson) throw new ServiceUnavailableException('Person User ID Not been Updated');
    console.log('Updated Person: ', updatedPerson);
    const emailVerifier = await this.emailVerifierService.create({
      user_id: user_id,
      email: email,
      verification_type: 0,
    });

    if (!emailVerifier) throw new ServiceUnavailableException('EmailVerifier Not Created');
    console.log('EmailVerifier: ', emailVerifier);

    await this.emailsService.sendAccountVerificationEmail(
      emailVerifier,
      {
        recipients: email,
      },
      parent_id,
      [],
    );
    return await Promise.all(
      student_ids.map(async (student) => {
        const observer = await this.observersRepository.save({
          observer_id: null,
          parent_id: parent_id,
          student_id: student,
          person_id: person_id,
        });
        return observer;
      }),
    );
  }

  async update(observerInput: ObserverInput): Promise<Observer> {
    return await this.observersRepository.save(observerInput);
  }
}
