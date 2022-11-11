import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, In } from 'typeorm';
import { Parent } from '../models/parent.entity';
import { CreateParentInput } from '../dto/new-parent.inputs';
import { UpdatePersonAddressInput } from '../dto/update-person-address.inputs';
import { BadRequestException } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { UsersService } from '../services/users.service';
import { AddressService } from './address.service';
import { PhonesService } from './phones.service';
import { PersonAddressService } from './person-address.service';
import { ObserversService } from './observers.service';
@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    private personService: PersonsService,
    private addressService: AddressService,
    private phoneService: PhonesService,
    private personAddressService: PersonAddressService,
    private observerService: ObserversService,
    private usersService: UsersService,
  ) { }

  async findOneById(parent_id: number): Promise<Parent> {
    // return await createQueryBuilder(Parent)
    //   .innerJoin(Student, 'students', 'students.parent_id = parent.parent_id')
    //   .where('parent.parent_id = :id', { id: parent_id })
    //   .printSql()
    //   .getOne();
    return this.parentsRepository.findOne(parent_id, {
      // relations: [
      //   'person',
      //   'person.user',
      //   'person.user.userRegion',
      //   'person.user.userRegion.regionDetail',
      // ],
    });
  }

  //  Find Parents by person ids
  async findByPersonId(person_ids: number | number[]): Promise<Parent[]> {
    return this.parentsRepository.find({
      where: {
        person_id: In(typeof person_ids == 'number' ? [person_ids] : person_ids),
      },
    });
  }

  async findOneByEmail(parent_email: string): Promise<Parent> {
    const parentUser = await this.usersService.findOneByEmail(parent_email);
    if (!parentUser) {
      throw new BadRequestException('Parent Email does not exist');
    } else {
      if (parentUser.level !== 15) {
        throw new BadRequestException('Email address does not relate to any Parent.');
      }
    }
    const parent = await this.parentsRepository
      .createQueryBuilder('parent')
      .leftJoinAndSelect('parent.person', 'person')
      .leftJoinAndSelect('person.user', 'user')
      .where('user.user_id = :id', { id: parentUser.user_id })
      .printSql()
      .getOne();
    return parent;
  }

  async create(parent: CreateParentInput): Promise<Parent> {
    return this.parentsRepository.save(parent);
  }

  async update(updatePersonInput: UpdatePersonAddressInput): Promise<boolean> {
    try {
      const { parent_id, person, phone, address, notes, observer_id } = updatePersonInput;
      const data = Object.assign(person);
      data.person_id = Number(data.person_id);
      delete data.address;

      address.address_id = address.address_id;
      phone.phone_id = Number(phone.phone_id);

      const personData = await this.personService.update(data);

      const addressData = await this.addressService.update(address);
      const phoneData = await this.phoneService.create(phone);

      await this.personAddressService.create({
        person_id: personData.person_id,
        address_id: addressData.address_id,
      });
      if (parent_id) {
        await this.parentsRepository.update(parent_id, { notes: notes });
      }
      if (observer_id) {
        this.observerService.update({ observer_id, notes });
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
