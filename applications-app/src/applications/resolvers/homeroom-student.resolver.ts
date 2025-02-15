import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { HomeroomStudentService } from '../services/homeroom-student.service';
import { HomeroomStudentInput } from '../dto/homeroom-student.inputs';
import { HomeroomStudent } from '../models/homeroom-student.entity';

@Resolver(() => HomeroomStudent)
export class HomeroomStudentResolver {
  constructor(private service: HomeroomStudentService) {}

  @Mutation(() => Boolean, { name: 'assignStudentToHomeroom' })
  @UseGuards(new AuthGuard())
  async assignStudentToHomeroom(
    @Args('homeroomStudentInput')
    homeroomStudentInput: HomeroomStudentInput,
  ): Promise<boolean> {
    return this.service.assignStudentToHomeroom(homeroomStudentInput);
  }

  @Mutation(() => Boolean, { name: 'transferStudentToHomeroom' })
  @UseGuards(new AuthGuard())
  async createNewMaster(
    @Args('homeroomStudentInput')
    homeroomStudentInput: HomeroomStudentInput,
  ): Promise<boolean> {
    return this.service.transferStudentToHomeroom(homeroomStudentInput);
  }
}
