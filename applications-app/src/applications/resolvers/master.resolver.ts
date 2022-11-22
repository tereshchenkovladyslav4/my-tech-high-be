import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Master } from '../models/master.entity';
import { MasterService } from '../services/master.service';
import { CreateNewMasterInput } from '../dto/create-new-master.input';

@Resolver((of) => Master)
export class MasterResolver {
  constructor(private service: MasterService) { }


  @Query((returns) => [Master], { name: 'getMastersBySchoolId' })
  @UseGuards(new AuthGuard())
  async getMastersBySchoolId(@Args('schoolYearId', { type: () => Int }) schoolYearId: number): Promise<Master[]> {
    return this.service.getAll(schoolYearId);
  }

  @Query((returns) => Master, { name: 'getMastersById' })
  @UseGuards(new AuthGuard())
  async getMastersById(@Args('masterId', { type: () => Int }) masterId: number): Promise<Master> {
    return this.service.getById(masterId);
  }

  @Mutation((returns) => Boolean, { name: 'createNewMaster' })
  @UseGuards(new AuthGuard())
  async createNewMaster(
    @Args('createNewMasterInput')
    createNewMasterInput: CreateNewMasterInput,
  ): Promise<Boolean> {
    return this.service.save(createNewMasterInput);
  }
}
