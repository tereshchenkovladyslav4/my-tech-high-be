import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getConnection } from 'typeorm';
import { PersonAddress } from '../models/person-address.entity';
import { CreatePersonAddressInput } from '../dto/new-person-address.inputs';
import { Address } from '../models/address.entity';
import { Person } from '../models/person.entity';
import { CreateAddressInput } from '../dto/new-address.inputs';

@Injectable()
export class PersonAddressService {
  constructor(
    @InjectRepository(PersonAddress)
    private readonly personAddressRepository: Repository<PersonAddress>,
  ) {}

  async create(personAddressInput: CreatePersonAddressInput): Promise<PersonAddress> {
    return this.personAddressRepository.save(personAddressInput);
  }

  findOneById(person_id: number): Promise<PersonAddress> {
    return this.personAddressRepository.findOne({
      where: { person_id },
    });
  }

  async createOrUpdate(person: Person, addressInputs: CreateAddressInput): Promise<PersonAddress> {
    // Update Address
    const hasAddress = await createQueryBuilder(PersonAddress)
      .innerJoin(Person, 'person', 'person.person_id = `PersonAddress`.person_id')
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
            street: addressInputs.street,
            street2: addressInputs.street2 || '',
            city: addressInputs.city,
            state: addressInputs.state,
            zip: addressInputs.zip,
            county_id: addressInputs.county_id || null,
            country_id: addressInputs.country_id || null,
            school_district: addressInputs.school_district || null,
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
          street: addressInputs.street,
          street2: addressInputs.street2 || '',
          city: addressInputs.city,
          state: addressInputs.state,
          zip: addressInputs.zip,
          county_id: addressInputs.county_id || null,
          country_id: addressInputs.country_id || null,
          school_district: addressInputs.school_district || null,
        })
        .where('address_id = :id', { id: hasAddress.address_id })
        .execute();
    }

    return this.personAddressRepository.findOne({
      where: { person_id: person.person_id },
    });
  }
}
