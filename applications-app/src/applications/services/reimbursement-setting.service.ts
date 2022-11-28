import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReimbursementSetting } from '../models/reimbursement-setting.entity';
import { ReimbursementSettingInput } from '../dto/reimbursement-setting.inputs';

@Injectable()
export class ReimbursementSettingService {
  constructor(
    @InjectRepository(ReimbursementSetting)
    private readonly repo: Repository<ReimbursementSetting>,
  ) {}

  async save(reimbursementSettingInput: ReimbursementSettingInput): Promise<ReimbursementSetting> {
    try {
      return await this.repo.save({ ...reimbursementSettingInput });
    } catch (error) {
      return error;
    }
  }
}
