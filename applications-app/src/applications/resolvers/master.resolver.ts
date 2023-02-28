import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Master } from '../models/master.entity';
import { MasterService } from '../services/master.service';
import { CreateNewMasterInput } from '../dto/create-new-master.input';
import { CreateNewClassInput } from '../dto/create-new-class.input';
import { ClassesService } from '../services/classes.service';
import { CreateOrUpdateInstructions } from '../dto/create-new-master-instruction.input';
import { ResponseDTO } from '../dto/response.dto';
import { Classes } from '../models/classes.entity';

@Resolver(() => Master)
export class MasterResolver {
  constructor(private service: MasterService, private classesService: ClassesService) {}

  @Query(() => [Master], { name: 'getMastersBySchoolId' })
  @UseGuards(new AuthGuard())
  async getMastersBySchoolId(@Args('schoolYearId', { type: () => Int }) schoolYearId: number): Promise<Master[]> {
    return this.service.getAll(schoolYearId);
  }

  @Query(() => Master, { name: 'getMastersById' })
  @UseGuards(new AuthGuard())
  async getMastersById(@Args('masterId', { type: () => Int }) masterId: number): Promise<Master> {
    return this.service.getById(masterId);
  }

  @Mutation(() => Boolean, { name: 'createNewMaster' })
  @UseGuards(new AuthGuard())
  async createNewMaster(
    @Args('createNewMasterInput')
    createNewMasterInput: CreateNewMasterInput,
  ): Promise<boolean> {
    return this.service.save(createNewMasterInput);
  }

  @Mutation(() => Boolean, { name: 'deleteMasterById' })
  @UseGuards(new AuthGuard())
  async deleteMasterById(@Args('masterId', { type: () => Int }) masterId: number): Promise<boolean> {
    return this.service.deleteByMasterId(masterId);
  }

  @Mutation(() => Boolean, { name: 'deleteClassesById' })
  @UseGuards(new AuthGuard())
  async deleteClassesById(@Args('classId', { type: () => Int }) classId: number): Promise<boolean> {
    return this.classesService.deleteClassesById(classId);
  }

  @Mutation(() => Boolean, { name: 'updateMaster' })
  @UseGuards(new AuthGuard())
  async updateMaster(
    @Args('updateMaster')
    updateMasterInput: CreateNewMasterInput,
  ): Promise<boolean> {
    return this.service.update(updateMasterInput);
  }

  @Mutation(() => Boolean, { name: 'createNewClass' })
  @UseGuards(new AuthGuard())
  async createNewClass(
    @Args('createNewClassInput')
    createNewClassInput: CreateNewClassInput,
  ): Promise<boolean> {
    return this.classesService.saveClass(createNewClassInput);
  }

  @Mutation(() => Boolean, { name: 'createOrUpdateInstructions' })
  @UseGuards(new AuthGuard())
  async createOrUpdateInstructions(
    @Args('createOrUpdateInstructions')
    createOrUpdateInstructions: CreateOrUpdateInstructions,
  ): Promise<boolean> {
    return this.service.createOrUpdateInstructions(createOrUpdateInstructions);
  }

  @Query(() => ResponseDTO, { name: 'getTeachersByUserId' })
  @UseGuards(new AuthGuard())
  async getTeachersByUserId(@Args('userId', { type: () => Int }) userId: number): Promise<ResponseDTO> {
    return this.classesService.getTeachersByUserId(userId);
  }

  @Query(() => Classes, { name: 'getClassById' })
  @UseGuards(new AuthGuard())
  async classById(@Args('classId', { type: () => Int }) classId: number): Promise<Classes> {
    return this.classesService.getClassById(classId);
  }
}
