import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ReimbursementSettingService } from '../services/reimbursement-setting.service';
import { ReimbursementSetting } from '../models/reimbursement-setting.entity';
import { ReimbursementSettingInput } from '../dto/reimbursement-setting.inputs';

@Resolver(() => ReimbursementSetting)
export class ReimbursementSettingResolver {
  constructor(private service: ReimbursementSettingService) {}

  @Mutation(() => ReimbursementSetting, { name: 'createOrUpdateReimbursementSetting' })
  @UseGuards(new AuthGuard())
  async createOrUpdateReimbursementSetting(
    @Args('reimbursementSettingInput')
    reimbursementSettingInput: ReimbursementSettingInput,
  ): Promise<ReimbursementSetting> {
    return this.service.save(reimbursementSettingInput);
  }
}
