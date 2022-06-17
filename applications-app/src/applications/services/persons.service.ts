import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Person } from '../models/person.entity';
import { CreateParentPersonInput } from '../dto/new-parent-person.inputs';
import { CreatePersonInput } from '../dto/new-person.inputs';
import { SavePersonUserIdInput } from '../dto/save-person-user-id.inputs';
import { UpdatePersonInput } from '../dto/update-person.inputs';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person)
    private repo: Repository<Person>,
  ) { }

  findOneById(person_id: number): Promise<Person> {
    return this.repo.findOne(person_id);
  }
  
  findOneByUserId(user_id: number): Promise<Person> {
    return this.repo.findOne({ user_id });
  }

  async create(person: CreatePersonInput): Promise<Person> {
    return this.repo.save(person);
  }

  async update(updatePersonInput: UpdatePersonInput): Promise<Person> {
    return this.repo.save(updatePersonInput);
  }

  async updateUserId(
    savePersonUserIdInput: SavePersonUserIdInput,
  ): Promise<Person> {
    return this.repo.save(savePersonUserIdInput);
  }

  async delete(person_id: number): Promise<Person> {
    const person = await this.findOneById(person_id);
    await this.repo.delete(person_id);
    return person;
  }

  //  Find Persons by user ids
  async findByUserId(user_ids: number | number[]) : Promise<Person[]> {
    return this.repo.find(
      {
        where: {
          user_id: In(typeof(user_ids) == 'number' ? [user_ids] : user_ids)
        }
      }
    );
  }
}
