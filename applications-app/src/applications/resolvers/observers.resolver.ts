import {
  Args,
  ID,
  Query,
  Resolver,
  ResolveReference,
  Int,
  ResolveField,
  Parent as TypeParent,
  Mutation,
  Context,
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
import { Observer } from '../models/observer.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ObserverInput } from '../dto/observer.inputs';
import { ObserversService } from '../services/observers.service';
@Resolver((of) => Observer)
export class ObserversResolver {
  constructor(
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private parentsService: ParentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private packetsService: PacketsService,
    private applicationsService: ApplicationsService,
    private observerService: ObserversService,
  ) {}

  @ResolveField((of) => Person, { name: 'person' })
  public async getPerson(@TypeParent() observer: Observer): Promise<Person> {
    return this.personsService.findOneById(observer.person_id);
  }

  @Mutation((returns) => [Observer], { name: 'createObserver' })
  @UseGuards(new AuthGuard())
  async addApplication(
    @Args('observerInput')
    observerInput: ObserverInput,
  ): Promise<Observer[]> {
    return await this.observerService.create(observerInput);
  }
}
