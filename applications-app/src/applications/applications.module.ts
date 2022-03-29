import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { Person } from './models/person.entity';
import { Student } from './models/student.entity';
import { User } from './models/user.entity';
import { Parent } from './models/parent.entity';
import { Phone } from './models/phone.entity';
import { SchoolYear } from './models/schoolyear.entity';
import RepoModule from './repo.module';
import { ApplicationsResolver } from './resolvers/applications.resolver';
import { ParentApplication } from '../applications/models/parent-application.entity';
import { EnrollmentPacket } from '../applications/models/enrollment-packet.entity';
import { Address } from './models/address.entity';
import { PersonAddress } from './models/person-address.entity';
import { PacketsResolver } from './resolvers/packets.resolver';
import { ApplicationPagination } from './models/application-pagination.entity';
import { PacketPagination } from './models/packet-pagination.entity';
import { StudentsResolver } from './resolvers/students.resolver';
import { UploadedFileResponse } from './models/uploaded-file-response.entity';
import { ParentsResolver } from './resolvers/parents.resolver';
import { ObserversResolver } from './resolvers/observers.resolver';
import { Observer } from './models/observer.entity';
import { StudentImmunizationResolver } from './resolvers/student-immunization.resolver';
import { StudentImmunization } from './models/student-immunization.entity';
import { Settings } from './models/settings.entity';
import { SettingsResolver } from './resolvers/settings.resolver';
import { ApplicationRegion } from './models/region.entity';
import { ApplicationUserRegion } from './models/user-region.entity';
import { ApplicationEmailTemplate } from './models/email-template.entity';
import { ApplicationQuestionsResolver } from './resolvers/application-questions.resolver';
import { ApplicationQuestion } from './models/application-question.entity';

const graphQLImports = [
  ApplicationsResolver,
  PacketsResolver,
  StudentsResolver,
  ParentsResolver,
  ObserversResolver,
  StudentImmunizationResolver,
  SettingsResolver,
  ApplicationQuestionsResolver,
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
          Student,
          User,
          Parent,
          Phone,
          SchoolYear,
          ParentApplication,
          EnrollmentPacket,
          Address,
          PersonAddress,
          ApplicationPagination,
          PacketPagination,
          //FileUpload,
          UploadedFileResponse,
          Observer,
          StudentImmunization,
          Settings,
          ApplicationRegion,
          ApplicationUserRegion,
          ApplicationEmailTemplate,
          ApplicationQuestion,
        ],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot(),
    RepoModule,
    ...graphQLImports,
  ],
})
export class ApplicationsGraphqlModule {}
