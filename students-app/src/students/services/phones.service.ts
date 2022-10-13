import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phone } from '../models/phone.entity';
@Injectable()
export class PhonesService {
  constructor(
    @InjectRepository(Phone)
    private phonesRepository: Repository<Phone>,
  ) {}

  findOneByPersonId(person_id: number): Promise<Phone> {
    return this.phonesRepository.findOne({ person_id: person_id });
  }
}
