import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Master } from '../models/master.entity';
import { HomeroomStudentService } from '../services/homeroom-student.service';
import { HomeroomStudentInput } from '../dto/homeroom-student.inputs';

@Resolver((of) => Master)
export class HomeroomStudentResolver {
  constructor(
    private service: HomeroomStudentService,
  ) { }


  // @Query((returns) => [Master], { name: 'getMastersBySchoolId' })
  // @UseGuards(new AuthGuard())
  // async getMastersBySchoolId(@Args('schoolYearId', { type: () => Int }) schoolYearId: number): Promise<Master[]> {
  //   return this.service.getAll(schoolYearId);
  // }

  @Mutation((returns) => Boolean, { name: 'assignStudentToHomeroom' })
  @UseGuards(new AuthGuard())
  async createNewMaster(
    @Args('createNewMasterInput')
    homeroomStudentInput: HomeroomStudentInput,
  ): Promise<Boolean> {
    return this.service.assignStudentToHomeroom(homeroomStudentInput);
  }
}
