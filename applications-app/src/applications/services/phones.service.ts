import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from '../models/phone.entity';
import { CreatePersonPhoneInput } from '../dto/new-person-phone.inputs';

@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phone)
    private phonesRepository: Repository<Phone>,
  ) {}

  async create(phone: CreatePersonPhoneInput): Promise<Phone> {
    return this.phonesRepository.save(phone);
  }

  findOneByPersonId(person_id: number): Promise<Phone> {
    return this.phonesRepository.findOne({
      where: { person_id },
    });
  }
}
