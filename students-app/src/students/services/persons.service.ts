import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../models/person.entity';
import { PersonsArgs } from '../dto/persons.args';
import { SavePersonUserIdInput } from '../dto/save-student-user-id.inputs';
@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
  ) {}

  findAll(personsArgs: PersonsArgs): Promise<Person[]> {
    return this.personsRepository.find(personsArgs);
  }

  findOneById(person_id: number): Promise<Person> {
    return this.personsRepository.findOne(person_id);
  }

  async findOneByEmail(email: string): Promise<boolean> {
    const personData = email.split('-');
    const personEmail = personData[0];
    const personId = personData[1];
    const user = await this.personsRepository.findOne({ email: personEmail });
    if (user && user.person_id !== parseInt(personId)) {
      return true;
    }
    return false;
  }

  async updateUserId(savePersonUserIdInput: SavePersonUserIdInput): Promise<Person> {
    return this.personsRepository.save(savePersonUserIdInput);
  }
}
