import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Subject } from '../models/subject.entity';
import { SubjectService } from '../services/subject.service';
import { CreateOrUpdateSubjectInput } from '../dto/create-or-update-subject.inputs';
import { FindSubjectsInput } from '../dto/find-subjects.input';

@Resolver(() => Subject)
export class SubjectResolver {
  constructor(private service: SubjectService) {}

  @Query(() => [Subject], { name: 'subjects' })
  @UseGuards(new AuthGuard())
  get(
    @Args('findSubjectsInput')
    findSubjectsInput: FindSubjectsInput,
  ): Promise<Subject[]> {
    return this.service.find(findSubjectsInput);
  }

  @Mutation(() => Subject, { name: 'createOrUpdateSubject' })
  @UseGuards(new AuthGuard())
  async createOrUpdateSubject(
    @Args('createSubjectInput')
    createSubjectInput: CreateOrUpdateSubjectInput,
  ): Promise<Subject> {
    return this.service.save(createSubjectInput);
  }

  @Mutation(() => Boolean, { name: 'deleteSubject' })
  @UseGuards(new AuthGuard())
  async deleteSubject(
    @Args('subjectId')
    subjectId: number,
  ): Promise<boolean> {
    return this.service.delete(subjectId);
  }
}
