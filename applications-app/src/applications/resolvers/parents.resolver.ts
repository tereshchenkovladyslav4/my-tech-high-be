import {
  Args,
  ID,
  Query,
  Mutation,
  Resolver,
  ResolveReference,
  ResolveField,
  Parent as TypeParent,
} from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { Parent } from '../models/parent.entity';
import { StudentsService } from '../services/students.service';
import { ParentsService } from '../services/parents.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { UpdatePersonAddressInput } from '../dto/update-person-address.inputs';
import { Observer } from '../models/observer.entity';
import { ObserversService } from '../services/observers.service';
@Resolver(() => Parent)
export class ParentsResolver {
  constructor(
    private studentsService: StudentsService,
    private parentsService: ParentsService,
    private observersService: ObserversService,
  ) {}

  @ResolveReference()
  resolveReference(reference: { __typename: string; parent_id: number }): Promise<Parent> {
    return this.parentsService.findOneById(reference.parent_id);
  }

  @ResolveField(() => [Student], { name: 'students' })
  public async getStudents(@TypeParent() parent: Parent): Promise<Student[]> {
    return this.studentsService.findOneByParent(parent.parent_id);
  }

  @ResolveField(() => [Observer], { name: 'observers' })
  public async getObservers(@TypeParent() parent: Parent): Promise<Observer[]> {
    return await this.observersService.findOneByParent(parent.parent_id);
  }

  @Query(() => Parent, { name: 'parentDetail' })
  @UseGuards(new AuthGuard())
  async getApplication(@Args({ name: 'id', type: () => ID }) parent_id: number): Promise<Parent> {
    return this.parentsService.findOneById(parent_id);
  }

  @Query(() => Parent, { name: 'parentDetailByEmail' })
  @UseGuards(new AuthGuard())
  async getParent(@Args({ name: 'email', type: () => String }) parent_email: string): Promise<Parent> {
    return this.parentsService.findOneByEmail(parent_email);
  }

  @Mutation(() => Parent, { name: 'updatePersonAddress' })
  @UseGuards(new AuthGuard())
  async updatePersonAddress(
    @Args('updatePersonAddressInput')
    updatePersonAddressInput: UpdatePersonAddressInput,
  ): Promise<boolean> {
    return this.parentsService.update(updatePersonAddressInput);
  }
}
