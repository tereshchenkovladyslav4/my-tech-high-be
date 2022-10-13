import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { Phone } from '../models/phone.entity';
import { Address } from '../models/address.entity';
import { PersonAddress } from '../models/person-address.entity';
@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async findOneByPersonId(person_id: number): Promise<Address> {
    return await createQueryBuilder(Address)
      .innerJoin(PersonAddress, 'personaddress', 'personaddress.address_id = `Address`.address_id')
      .where('personaddress.person_id = :id', { id: person_id })
      .printSql()
      .getOne();

    //return this.addressRepository.findOne(address.address_id);
  }
}
