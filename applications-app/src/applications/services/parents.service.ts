import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { Parent } from '../models/parent.entity';
import { CreateParentInput } from '../dto/new-parent.inputs';
import { Student } from '../models/student.entity';
import { UpdatePersonAddressInput } from '../dto/update-person-address.inputs';
import { PersonsService } from './persons.service';
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
  ) {}

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

  async create(parent: CreateParentInput): Promise<Parent> {
    return this.parentsRepository.save(parent);
  }

  async update(updatePersonInput: UpdatePersonAddressInput): Promise<boolean> {
    try {
      const { parent_id, person, phone, address, notes, observer_id } =
        updatePersonInput;
      const data = Object.assign(person);
      data.person_id = Number(data.person_id);
      delete data.address;

      address.address_id = address.address_id;
      phone.phone_id = Number(phone.phone_id);

      const personData = await this.personService.update(data);
      if (!phone.phone_id) {
        phone.person_id = personData.person_id;
      }
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
