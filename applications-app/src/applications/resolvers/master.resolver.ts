import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Master } from '../models/master.entity';
import { MasterService } from '../services/master.service';
import { CreateNewMasterInput } from '../dto/create-new-master.input';
import { CreateNewClassInput } from '../dto/create-new-class.input';
import { ClassesService } from '../services/classes.service';

@Resolver((of) => Master)
export class MasterResolver {
  constructor(
    private service: MasterService,
    private classesService: ClassesService
  ) { }


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

  @Mutation((returns) => Boolean, { name: 'updateMaster' })
  @UseGuards(new AuthGuard())
  async updateMaster(
    @Args('updateMaster')
    updateMasterInput: CreateNewMasterInput,
  ): Promise<Boolean> {
    return this.service.update(updateMasterInput);
  }

  @Mutation((returns) => Boolean, { name: 'createNewClass' })
  @UseGuards(new AuthGuard())
  async createNewClass(
    @Args('createNewClassInput')
    createNewClassInput: CreateNewClassInput,
  ): Promise<Boolean> {
    return this.classesService.saveClass(createNewClassInput);
  }
}
