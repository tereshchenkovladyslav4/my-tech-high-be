import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Person } from './models/person.entity';
import { Student } from './models/student.entity';
import { Parent } from './models/parent.entity';
import { StudentGradeLevel } from './models/student-grade-level.entity';
import { Phone } from './models/phone.entity';
import { SchoolYearsService } from './services/schoolyears.service';
import { UsersService } from './services/users.service';
import { PersonsService } from './services/persons.service';
import { StudentsService } from './services/students.service';
import { ParentsService } from './services/parents.service';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { PhonesService } from './services/phones.service';
import { SchoolYear } from './models/schoolyear.entity';
import { ParentToDosService } from './services/parent-todos.service';
import { ParentToDo } from './models/parent-todo.entity';
import { ToDoItem } from './models/todo-item.entity';
import { ApplicationsService } from './services/applications.service';
import { Application } from './models/application.entity';
import { PacketsService } from './services/packets.service';
import { Packet } from './models/packet.entity';
import { Address } from './models/address.entity';
import { AddressService } from './services/address.service';
import { EmailVerifier } from './models/email-verifier.entity';
import { EmailVerifiersService } from './services/email-verifiers.service';
import { StudentStatusService } from './services/student-status.service';
import { StudentStatus } from './models/student-status.entity';
import { StudentStatusHistoryService } from './services/student-status-history.service';
import { StudentStatusHistory } from './models/student-status-history.entity';
const servicesImports = [
    UsersService,
    PersonsService,
    StudentsService,
    ParentsService,
    StudentGradeLevelsService,
    PhonesService,
    SchoolYearsService,
    ParentToDosService,
    ApplicationsService,
    PacketsService, 
    AddressService,
    EmailVerifiersService,
    StudentStatusService,
    StudentStatusHistoryService,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
        User, Person, Student, Parent, StudentGradeLevel, Phone, Address, SchoolYear, Application, Packet,EmailVerifier, StudentStatus, StudentStatusHistory
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {

}
export default RepoModule;