import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentUser } from '../../models/parent.entity';
import { CreateParentUserInput } from '../dto/parentUser/create-parent-user.input';

@Injectable()
export class ParentUserService {
  constructor(
    @InjectRepository(ParentUser)
    private readonly parentRepository: Repository<ParentUser>,
  ) {}

  async createParent(createParentUserInput: CreateParentUserInput): Promise<ParentUser> {
    const data = this.parentRepository.create(createParentUserInput);
    return await this.parentRepository.save(data);
  }
}
