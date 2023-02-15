import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { StudentsResolver } from './resolvers/students.resolver';
import { PersonsResolver } from './resolvers/persons.resolver';
import { Person } from './models/person.entity';
import { Parent } from './models/parent.entity';
import { Phone } from './models/phone.entity';
import { SchoolYear } from './models/schoolyear.entity';
import { StudentGradeLevel } from './models/student-grade-level.entity';
import RepoModule from './repo.module';
import { UsersResolver } from './resolvers/users.resolver';
import { ParentsResolver } from './resolvers/parents.resolver';
import { StudentGradeLevelsResolver } from './resolvers/student-grade-levels.resolver';
import { ParentToDo } from './models/parent-todo.entity';
import { ToDoItem } from './models/todo-item.entity';
import { ParentToDosResolver } from './resolvers/parent-todos.resolver';
import { SchoolYearResolver } from './resolvers/schoolyear.resolver';
import { StudentCurrentStatus } from './models/student-current-status.entity';
import { Address } from './models/address.entity';
import { PersonAddress } from './models/person-address.entity';
import { StudentStatusResolver } from './resolvers/student-status.resolver';
import { StudentStatus } from './models/student-status.entity';
import { StudentStatusHistory } from './models/student-status-history.entity';
import { SchoolEnrollment } from './models/school-enrollment.entity';
import { ResourceResolver } from './resolvers/resource.resolover';
import { Resource } from './models/resource.entity';
import { StudentRecordResolver } from './resolvers/student-record.resolver';
import { StudentRecord } from './models/student-record.entity';
import { StudentRecordFile } from './models/student-record-file.entity';
import { File } from './models/file.entity';
import { PeriodResolver } from './resolvers/period.resolver';
import { Schedule } from './models/schedule.entity';
import { SchedulePeriod } from './models/schedule-period.entity';
import { ProviderResolver } from './resolvers/provider.resolver';
import { HomeroomStudent } from './models/homeroom-student.entity';
import { Classes } from './models/classes.entity';
import { ResourceRequest } from './models/resource-request.entity';
import { DiplomaQuestion } from './models/diploma-question.entity';
import { DiplomaAnswer } from './models/diploma-answer.entity';
import { StudentHomeroomResolver } from './resolvers/student-homeroom.resolver';

const graphQLImports = [
  StudentsResolver,
  PersonsResolver,
  UsersResolver,
  ParentsResolver,
  StudentGradeLevelsResolver,
  ParentToDosResolver,
  SchoolYearResolver,
  StudentStatusResolver,
  ResourceResolver,
  StudentRecordResolver,
  PeriodResolver,
  ProviderResolver,
  StudentHomeroomResolver,
];
@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      plugins: [ApolloServerPluginInlineTraceDisabled()],
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
        orphanedTypes: [
          Person,
          Parent,
          StudentGradeLevel,
          Phone,
          Address,
          PersonAddress,
          SchoolYear,
          ParentToDo,
          ToDoItem,
          StudentCurrentStatus,
          StudentStatus,
          File,
          StudentRecord,
          StudentRecordFile,
          StudentStatusHistory,
          Resource,
          SchoolEnrollment,
          Schedule,
          SchedulePeriod,
          HomeroomStudent,
          Classes,
          ResourceRequest,
          DiplomaQuestion,
          DiplomaAnswer,
        ],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot(),
    RepoModule,
    ...graphQLImports,
  ],
})
export class StudentsGraphqlModule {}
