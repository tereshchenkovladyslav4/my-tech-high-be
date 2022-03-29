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
import { ApplicationEmail } from './models/application-email.entity';
import { StudentStatus } from './models/student-status.entity';
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
  ObserversService,
  StudentImmunizationService,
  StudentStatusService,
  SettingsService,
  UserRegionService,
  EmailTemplatesService,
  ApplicationQuestionsService,
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
      StudentStatus,
      Observer,
      StudentImmunization,
      Settings,
      ApplicationRegion,
      ApplicationUserRegion,
      ApplicationEmailTemplate,
      ApplicationQuestion,
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {}
export default RepoModule;
