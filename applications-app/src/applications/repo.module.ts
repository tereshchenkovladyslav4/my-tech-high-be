import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Person } from './models/person.entity';
import { Student } from './models/student.entity';
import { Parent } from './models/parent.entity';
import { Phone } from './models/phone.entity';
import { SchoolYear } from './models/schoolyear.entity';
import { UsersService } from './services/users.service';
import { PersonsService } from './services/persons.service';
import { StudentsService } from './services/students.service';
import { ApplicationsService } from './services/applications.service';
import { Application } from './models/application.entity';
import { ParentsService } from './services/parents.service';
import { PhonesService } from './services/phones.service';
import { SchoolYearService } from './services/schoolyear.service';
import { StudentGradeLevelsService } from './services/student-grade-levels.service';
import { ApplicationsService as StudentApplicationsService } from './applications.service';
import { StudentGradeLevel } from './models/student-grade-level.entity';
import { PacketsService } from './services/packets.service';
import { Packet } from './models/packet.entity';
import { Address } from './models/address.entity';
import { PersonAddress } from './models/person-address.entity';
import { EnrollmentsService } from './enrollments.service';
import { PersonAddressService } from './services/person-address.service';
import { AddressService } from './services/address.service';
import { PacketFilesService } from './services/packet-files.service';
import { FilesService } from './services/files.service';
import { PacketFile } from './models/packet-file.entity';
import { File } from './models/file.entity';
import { S3Service } from './services/s3.service';
import { SESService } from './services/ses.service';
import { CoreSetting } from './models/core-setting.entity';
import { CoreSettingsService } from './services/core-settings.service';
import { EmailsService } from './services/emails.service';
import { EmailVerifier } from './models/email-verifier.entity';
import { EmailVerifierService } from './services/email-verifier.service';
import { ImmunizationSettingsService } from './services/immunization-settings.service';
import { ImmunizationSettings } from './models/immunization-settings.entity';
import { ApplicationEmailsService } from './services/application-emails.service';
import { PacketEmailsService } from './services/packet-emails.service';
import { ApplicationEmail } from './models/application-email.entity';
import { PacketEmail } from './models/packet-email.entity';
import { StudentStatus } from './models/student-status.entity';
import { StudentReenrollmentStatus } from './models/student-reenrollment-status.entity';
import { Observer } from './models/observer.entity';
import { ObserversService } from './services/observers.service';
import { StudentImmunizationService } from './services/student-immunization.service';
import { StudentImmunization } from './models/student-immunization.entity';
import { StudentStatusService } from './services/student-status.service';
import { Settings } from './models/settings.entity';
import { SettingsService } from './services/settings.service';
import { Region } from './models/region.entity';
import { UserRegion } from './models/user-region.entity';
import { UserRegionService } from './services/user-region.service';
import { EmailTemplatesService } from './services/email-templates.service';
import { ApplicationEmailTemplate } from './models/email-template.entity';
import { ApplicationQuestionsService } from './services/application-questions.service';
import { ApplicationQuestion } from './models/application-question.entity';
import { EnrollmentQuestionTabService } from './services/enrollment-question-tab.service';
import { EnrollmentQuestionTab } from './models/enrollment-question-tab.entity';
import { EnrollmentQuestionGroup } from './models/enrollment-question-group.entity';
import { EnrollmentQuestions } from './models/enrollment-questions.entity';
import { EnrollmentQuestionGroupService } from './services/enrollment-question-group.service';
import { EnrollmentQuestionsService } from './services/enrollment-questions.service';
import { EmailReminderService } from './services/email-reminder.service';
import { EmailRecordsService } from './services/email-records.service';
import { EmailReminder } from './models/email-reminder.entity';
import { WithdrawalService } from './services/withdrawal.service';
import { Withdrawal } from './models/withdrawal.entity';
import { AnnouncementsService } from './services/announcements.service';
import { Announcement } from './models/announcement.entity';
import { CronJobService } from './services/cronJob.service';
import { UserAnnouncementsService } from './services/user-announcements.service';
import { UserAnnouncement } from './models/user-announcement.entity';
import { EventTypesService } from './services/event-types.service';
import { EventType } from './models/event-type.entity';
import { WithdrawalEmailsService } from './services/withdrawal-emails.service';
import { WithdrawalEmail } from './models/withdrawal-email.entity';
import { EventsService } from './services/event.service';
import { ApplicationEvent } from './models/event.entity';
import { CronJobsLog } from './models/cron-jobs-log.entity';
import { CronJobsLogsService } from './services/cron-jobs-logs.services';
import { ResourceService } from './services/resource.service';
import { Resource } from './models/resource.entity';
import { SchoolEnrollment } from './models/school-enrollment.entity';
import { EmailRecord } from './models/email-record.entity';
import { StudentRecordService } from './services/student-record.service';
import { Role } from './models/role.entity';
import { ResourceLevelService } from './services/resource-level.service';
import { ResourceLevel } from './models/resource-level.entity';
import { AssessmentService } from './services/assessment.service';
import { Assessment } from './models/assessment.entity';
import { DiplomaQuestion } from './models/diploma-question.entity';
import { DiplomaService } from './services/diploma.service';
import { AssessmentOptionService } from './services/assessment-option.service';
import { StudentAssessmentService } from './services/student-assessment.service';
import { AssessmentOption } from './models/assessment-option.entity';
import { StudentAssessmentOption } from './models/student-assessment-option.entity';
import { PDFService } from './services/pdf.service';
import { DiplomaAnswer } from './models/diploma-answer.entity';
import { DiplomaAnswerService } from './services/diploma-answer.service';
import { Period } from './models/period.entity';
import { Title } from './models/title.entity';
import { Subject } from './models/subject.entity';
import { SubjectService } from './services/subject.service';
import { PeriodService } from './services/period.service';
import { TitleService } from './services/title.service';
import { ProviderService } from './services/provider.service';
import { Provider } from './models/provider.entity';
import { CourseService } from './services/course.service';
import { Course } from './models/course.entity';
import { TimezonesService } from './services/timezones.service';
import { ScheduleService } from './services/schedule.service';
import { Schedule } from './models/schedule.entity';
import { SchedulePeriod } from './models/schedule-period.entity';
import { SchedulePeriodService } from './services/schedule-period.service';
import { ScheduleEmailsService } from './services/schedule-emails.service';
import { ScheduleEmail } from './models/schedule-email.entity';
import { MasterService } from './services/master.service';
import { Master } from './models/master.entity';
import { ScheduleHistory } from './models/schedule-history.entity';
import { SchedulePeriodHistory } from './models/schedule-period-history.entity';
import { ClassesService } from './services/classes.service';
import { Classes } from './models/classes.entity';
import { Checklist } from './models/checklist.entity';
import { ChecklistService } from './services/checklist.service';
import { ReimbursementSetting } from './models/reimbursement-setting.entity';
import { ReimbursementSettingService } from './services/reimbursement-setting.service';
import { Assignment } from './models/assignment.entity';
import { AssignmentService } from './services/assignment.service';
import { HomeroomStudentService } from './services/homeroom-student.service';
import { HomeroomStudent } from './models/homeroom-student.entity';
import { LearningLogQuestionService } from './services/learning-log-question.service';
import { LearningLogQuestion } from './models/learning-log-question.entity';
import { StateCodesService } from './services/state-codes.service';
import { StateCodes } from './models/state-codes.entity';
import { ResourceRequestService } from './services/resource-request.service';
import { ResourceRequest } from './models/resource-request.entity';
import { ResourceRequestEmail } from './models/resource-request-email.entity';
import { ResourceRequestEmailsService } from './services/resource-request-emails.service';
import { ResourceCart } from './models/resource-cart.entity';

const servicesImports = [
  UsersService,
  PersonsService,
  StudentsService,
  ApplicationsService,
  ParentsService,
  PhonesService,
  SchoolYearService,
  StudentApplicationsService,
  StudentGradeLevelsService,
  PacketsService,
  EnrollmentsService,
  PersonAddressService,
  AddressService,
  PacketFilesService,
  FilesService,
  S3Service,
  SESService,
  CoreSettingsService,
  EmailsService,
  EmailVerifierService,
  ImmunizationSettingsService,
  ApplicationEmailsService,
  PacketEmailsService,
  ScheduleEmailsService,
  ObserversService,
  StudentImmunizationService,
  StudentStatusService,
  WithdrawalService,
  WithdrawalEmailsService,
  AnnouncementsService,
  EventTypesService,
  EventsService,
  UserAnnouncementsService,
  CronJobService,
  SettingsService,
  UserRegionService,
  EmailTemplatesService,
  EmailReminderService,
  ApplicationQuestionsService,
  EnrollmentQuestionTabService,
  EnrollmentQuestionGroupService,
  EnrollmentQuestionsService,
  CronJobsLogsService,
  ResourceService,
  AssessmentService,
  EmailRecordsService,
  StudentRecordService,
  ResourceLevelService,
  DiplomaService,
  AssessmentOptionService,
  StudentAssessmentService,
  PDFService,
  DiplomaAnswerService,
  DiplomaService,
  SubjectService,
  TitleService,
  PeriodService,
  ProviderService,
  CourseService,
  TimezonesService,
  ScheduleService,
  SchedulePeriodService,
  MasterService,
  ClassesService,
  ChecklistService,
  ReimbursementSettingService,
  AssignmentService,
  HomeroomStudentService,
  LearningLogQuestionService,
  StateCodesService,
  ResourceRequestService,
  ResourceRequestEmailsService,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Person,
      Student,
      Application,
      Parent,
      Phone,
      SchoolYear,
      StudentGradeLevel,
      Packet,
      Address,
      PersonAddress,
      PacketFile,
      File,
      CoreSetting,
      EmailVerifier,
      ImmunizationSettings,
      ApplicationEmail,
      PacketEmail,
      StudentStatus,
      StudentReenrollmentStatus,
      Withdrawal,
      WithdrawalEmail,
      ScheduleEmail,
      Announcement,
      EventType,
      ApplicationEvent,
      UserAnnouncement,
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
      EmailReminder,
      CronJobsLog,
      Resource,
      Assessment,
      SchoolEnrollment,
      EmailRecord,
      Role,
      ResourceLevel,
      DiplomaQuestion,
      AssessmentOption,
      StudentAssessmentOption,
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
      ResourceRequestEmail,
      ResourceCart,
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {}
export default RepoModule;
