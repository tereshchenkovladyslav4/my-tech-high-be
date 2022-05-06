import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../models/person.entity';
import { CreateParentPersonInput } from '../dto/new-parent-person.inputs';
import { CreatePersonInput } from '../dto/new-person.inputs';
import { SavePersonUserIdInput } from '../dto/save-person-user-id.inputs';
import { UpdatePersonInput } from '../dto/update-person.inputs';
@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private personsRepository: Repository<Person>,
  ) { }

  findOneById(person_id: number): Promise<Person> {
    return this.personsRepository.findOne(person_id);
  }

  async create(person: CreatePersonInput): Promise<Person> {
    return this.personsRepository.save(person);
  }

  async update(updatePersonInput: UpdatePersonInput): Promise<Person> {
    return this.personsRepository.save(updatePersonInput);
  }

  async updateUserId(
    savePersonUserIdInput: SavePersonUserIdInput,
  ): Promise<Person> {
    return this.personsRepository.save(savePersonUserIdInput);
  }

  async delete(person_id: number): Promise<Person> {
    const person = await this.findOneById(person_id);
    await this.personsRepository.delete(person_id);
    return person;
  }
}
