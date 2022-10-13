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

  async updateUserId(savePersonUserIdInput: SavePersonUserIdInput): Promise<Person> {
    return this.personsRepository.save(savePersonUserIdInput);
  }
}
