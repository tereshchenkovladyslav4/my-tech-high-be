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
import { Student } from './models/student.entity';
import { StudentStatus } from './models/student-status.entity';
import { StudentStatusHistory } from './models/student-status-history.entity';
import { SchoolPartnerResolver } from './resolvers/school-partner.resolver';
import { SchoolPartner } from './models/school-partner.entity';

const graphQLImports = [
  StudentsResolver, 
  PersonsResolver, 
  UsersResolver, 
  ParentsResolver, 
  StudentGradeLevelsResolver,
  ParentToDosResolver,
  SchoolYearResolver,
  StudentStatusResolver,
  SchoolPartnerResolver
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
        orphanedTypes: [Person, Parent, StudentGradeLevel, Phone, Address, PersonAddress, SchoolYear, ParentToDo, ToDoItem, StudentCurrentStatus, StudentStatus, StudentStatusHistory, SchoolPartner],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot(),
    RepoModule,
    ...graphQLImports
  ],
})
export class StudentsGraphqlModule {}
