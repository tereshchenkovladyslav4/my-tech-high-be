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
import { ApplicationRegion } from './models/region.entity';
import { ApplicationUserRegion } from './models/user-region.entity';
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
      Announcement,
      EventType,
      ApplicationEvent,
      UserAnnouncement,
      Observer,
      StudentImmunization,
      Settings,
      ApplicationRegion,
      ApplicationUserRegion,
      ApplicationEmailTemplate,
      ApplicationQuestion,
      EnrollmentQuestionTab,
      EnrollmentQuestionGroup,
      EnrollmentQuestions,
      EmailReminder,
      CronJobsLog,
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {}
export default RepoModule;
