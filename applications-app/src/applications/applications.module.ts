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
import { ParentApplication } from './models/parent-application.entity';
import { EnrollmentPacket } from './models/enrollment-packet.entity';
import { Address } from './models/address.entity';
import { PersonAddress } from './models/person-address.entity';
import { PacketsResolver } from './resolvers/packets.resolver';
import { ApplicationPagination } from './models/application-pagination.entity';
import { SchoolYearData } from './models/school-year-data.entity';
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
import { Region } from './models/region.entity';
import { UserRegion } from './models/user-region.entity';
import { ApplicationEmailTemplate } from './models/email-template.entity';
import { ApplicationQuestionsResolver } from './resolvers/application-questions.resolver';
import { EnrollmentQuestionTabResolver } from './resolvers/enrollment-question-tab.resolver';
import { ApplicationQuestion } from './models/application-question.entity';
import { EnrollmentQuestionTab } from './models/enrollment-question-tab.entity';
import { EnrollmentQuestionGroup } from './models/enrollment-question-group.entity';
import { EnrollmentQuestions } from './models/enrollment-questions.entity';
import { EnrollmentQuestionGroupResolver } from './resolvers/enrollment-question-groups.resolver';
import { AnnouncementsResolver } from './resolvers/announcements.resolver';
import { Announcement } from './models/announcement.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EventTypesResolver } from './resolvers/event-types.resolver';
import { WithdrawalResolver } from './resolvers/withdrawal.resolver';
import { EventsResolver } from './resolvers/event.resolver';
import { ResourceResolver } from './resolvers/resource.resolver';
import { EmailRecordResolver } from './resolvers/email-records.resolver';
import { Resource } from './models/resource.entity';
import { EmailRecord } from './models/email-record.entity';
import { ResourceLevel } from './models/resource-level.entity';
import { AssessmentResolver } from './resolvers/assessment.resolver';
import { Assessment } from './models/assessment.entity';
import { DiplomaResolver } from './resolvers/diploma.resolver';
import { DiplomaQuestion } from './models/diploma-question.entity';
import { StudentAssessmentResolver } from './resolvers/student-assessment.resolver';
import { DiplomaAnswer } from './models/diploma-answer.entity';
import { SubjectResolver } from './resolvers/subject.resolver';
import { Period } from './models/period.entity';
import { Title } from './models/title.entity';
import { Subject } from './models/subject.entity';
import { PeriodResolver } from './resolvers/period.resolver';
import { TitleResolver } from './resolvers/title.resolver';
import { ProviderResolver } from './resolvers/provider.resolver';
import { Provider } from './models/provider.entity';
import { CourseResolver } from './resolvers/course.resolver';
import { Course } from './models/course.entity';
import { TimezonesService } from './services/timezones.service';
import { ScheduleResolver } from './resolvers/schedule.resolver';
import { Schedule } from './models/schedule.entity';
import { SchedulePeriod } from './models/schedule-period.entity';
import { SchedulePeriodResolver } from './resolvers/schedule-period.resolver';
import { MasterResolver } from './resolvers/master.resolver';
import { Master } from './models/master.entity';
import { ScheduleHistory } from './models/schedule-history.entity';
import { SchedulePeriodHistory } from './models/schedule-period-history.entity';
import { Classes } from './models/classes.entity';
import { ChecklistResolver } from './resolvers/checklist.resolver';
import { Checklist } from './models/checklist.entity';
import { ReimbursementSetting } from './models/reimbursement-setting.entity';
import { ReimbursementSettingResolver } from './resolvers/reimbursement-setting.resolver';
import { Assignment } from './models/assignment.entity';
import { AssignmentResolver } from './resolvers/assignemtn.resolver';
import { HomeroomStudentResolver } from './resolvers/homeroom-student.resolver';
import { HomeroomStudent } from './models/homeroom-student.entity';
import { LearningLogQuestionResolver } from './resolvers/learning-log-question.resolver';
import { LearningLogQuestion } from './models/learning-log-question.entity';
import { StateCodesResolver } from './resolvers/state-code.resolver';
import { StateCodes } from './models/state-codes.entity';
import { ResourceRequestResolver } from './resolvers/resource-request.resolver';
import { ResourceRequest } from './models/resource-request.entity';
import { ResourceRequestPagination } from './models/resource-request-pagination.entity';
import { ResourceRequestEmail } from './models/resource-request-email.entity';

const graphQLImports = [
  ApplicationsResolver,
  PacketsResolver,
  StudentsResolver,
  WithdrawalResolver,
  AnnouncementsResolver,
  EventTypesResolver,
  EventsResolver,
  ParentsResolver,
  ObserversResolver,
  StudentImmunizationResolver,
  SettingsResolver,
  ApplicationQuestionsResolver,
  EnrollmentQuestionTabResolver,
  EnrollmentQuestionGroupResolver,
  WithdrawalResolver,
  ResourceResolver,
  AssessmentResolver,
  EmailRecordResolver,
  DiplomaResolver,
  StudentAssessmentResolver,
  SubjectResolver,
  PeriodResolver,
  TitleResolver,
  ProviderResolver,
  CourseResolver,
  TimezonesService,
  ScheduleResolver,
  SchedulePeriodResolver,
  MasterResolver,
  ChecklistResolver,
  ReimbursementSettingResolver,
  AssignmentResolver,
  HomeroomStudentResolver,
  LearningLogQuestionResolver,
  StateCodesResolver,
  ResourceRequestResolver,
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
          Announcement,
          Parent,
          Phone,
          SchoolYear,
          ParentApplication,
          EnrollmentPacket,
          Address,
          PersonAddress,
          ApplicationPagination,
          SchoolYearData,
          PacketPagination,
          //FileUpload,
          UploadedFileResponse,
          Observer,
          StudentImmunization,
          Settings,
          Region,
          UserRegion,
          ApplicationEmailTemplate,
          ApplicationQuestion,
          EnrollmentQuestionTab,
          EnrollmentQuestionGroup,
          EnrollmentQuestions,
          Resource,
          Assessment,
          EmailRecord,
          ResourceLevel,
          DiplomaQuestion,
          DiplomaAnswer,
          DiplomaQuestion,
          Period,
          Title,
          Subject,
          Provider,
          Course,
          Schedule,
          SchedulePeriod,
          Master,
          ScheduleHistory,
          SchedulePeriodHistory,
          Classes,
          Checklist,
          ReimbursementSetting,
          Assignment,
          HomeroomStudent,
          LearningLogQuestion,
          StateCodes,
          ResourceRequest,
          ResourceRequestPagination,
          ResourceRequestEmail,
        ],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    RepoModule,
    ...graphQLImports,
  ],
})
export class ApplicationsGraphqlModule {}
