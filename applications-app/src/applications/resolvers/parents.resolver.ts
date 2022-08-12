import {
  Args,
  ID,
  Query,
  Mutation,
  Resolver,
  ResolveReference,
  Int,
  ResolveField,
  Parent as TypeParent,
} from '@nestjs/graphql';
import { Student } from '../models/student.entity';
import { Person } from '../models/person.entity';
import { Parent } from '../models/parent.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { StudentGradeLevelsService } from '../services/student-grade-levels.service';
import { StudentsService } from '../services/students.service';
import { PersonsService } from '../services/persons.service';
import { ParentsService } from '../services/parents.service';
import { PacketsService } from '../services/packets.service';
import { ApplicationsService } from '../services/applications.service';
import { Packet } from '../models/packet.entity';
import { Application } from '../models/application.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Address } from '../models/address.entity';
import { PersonAddress } from '../models/person-address.entity';
import { AddressService } from '../services/address.service';
import { PersonAddressService } from '../services/person-address.service';
import { UpdatePersonAddressInput } from '../dto/update-person-address.inputs';
import { Observer } from '../models/observer.entity';
import { ObserversService } from '../services/observers.service';
@Resolver((of) => Parent)
export class ParentsResolver {
  constructor(
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private packetsService: PacketsService,
    private applicationsService: ApplicationsService,
    private addressService: AddressService,
    private personAddressService: PersonAddressService,
    private observersService: ObserversService,
  ) { }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    address_id: number;
  }): Promise<Address> {
    return this.addressService.findOneById(reference.address_id);
  }

  @ResolveField((of) => [Student], { name: 'students' })
  public async getStudents(@TypeParent() parent: Parent): Promise<Student[]> {
    return this.studentsService.findOneByParent(parent.parent_id);
  }

  @ResolveField((of) => [Observer], { name: 'observers' })
  public async getObservers(@TypeParent() parent: Parent): Promise<Observer[]> {
    return await this.observersService.findOneByParent(parent.parent_id);
  }

  @Query((returns) => Parent, { name: 'parentDetail' })
  @UseGuards(new AuthGuard())
  async getApplication(
    @Args({ name: 'id', type: () => ID }) parent_id: number,
  ): Promise<Parent> {
    return this.parentsService.findOneById(parent_id);
  }

  @Query((returns) => Parent, { name: 'parentDetailByEmail' })
  @UseGuards(new AuthGuard())
  async getParent(
    @Args({ name: 'email', type: () => String }) parent_email: string,
  ): Promise<Parent> {
    return this.parentsService.findOneByEmail(parent_email);
  }

  @Mutation((returns) => Parent, { name: 'updatePersonAddress' })
  @UseGuards(new AuthGuard())
  async updatePersonAddress(
    @Args('updatePersonAddressInput')
    updatePersonAddressInput: UpdatePersonAddressInput,
  ): Promise<boolean> {
    return this.parentsService.update(updatePersonAddressInput);
  }
}
