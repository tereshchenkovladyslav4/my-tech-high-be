import { UpdateAccessInput } from '../../dto/access/update-access.input';
import { CreateAccessInput } from '../../dto/access/create-access.input';
import { Access } from '../../../models/access.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
  ) {}

  async findAccessById(access_id: number): Promise<Access> {
    const data = await this.accessRepository.findOne({
      where: {
        id: access_id,
      },
      relations: ['access'],
    });
    return data;
  }

  getAllAccesses(): Promise<Access[]> {
    return this.accessRepository.find();
  }

  async createAccess(createAccessInput: CreateAccessInput): Promise<Access> {
    const data = this.accessRepository.create(createAccessInput);
    const updatedRecord = await this.accessRepository.save(data);
    return updatedRecord;
  }

  async updateAccess(updateAccessInput: UpdateAccessInput): Promise<any> {
    const data = {
      name: updateAccessInput.name,
    };
    const res = await this.accessRepository.update(updateAccessInput.id, data);
    if (res.affected > 0) {
      return this.findAccessById(updateAccessInput.id);
    } else {
      throw new HttpException('There is an error updating record', 422);
    }
  }

  async removeAccessById(access_id: number): Promise<string> {
    const data = await this.accessRepository.delete(access_id);
    if (data.affected > 0) {
      return 'Access Removed';
    } else {
      return 'Access with this ID does not exist';
    }
  }
}
