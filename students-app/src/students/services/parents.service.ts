import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../models/parent.entity';
@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
  ) {}

  findOneById(parent_id: number): Promise<Parent> {
    return this.parentsRepository.findOne(parent_id);
  }
}
