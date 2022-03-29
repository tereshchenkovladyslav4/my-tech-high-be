import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../models/address.entity';
import { CreateAddressInput } from '../dto/new-address.inputs';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) { }

  async create(address: CreateAddressInput): Promise<Address> {
    return this.addressRepository.save(address);
  }

  async update(address: CreateAddressInput): Promise<Address> {
    return this.addressRepository.save(address);
  }

  async findOneById(id: number): Promise<Address> {
    return this.addressRepository.findOne(id);
  }
}
