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
import { StudentReenrollmentStatus } from './models/student-reenrollment-status.entity';
import { UserRegion } from './models/user-region.entity';
import { Region } from './models/region.entity';
import { Withdrawal } from './models/withdrawal.entity';
import { WithdrawalEmail } from './models/withdrawal-email.entity';
import { Resource } from './models/resource.entity';
import { ResourceService } from './services/resource.service';
import { SchoolEnrollment } from './models/school-enrollment.entity';
import { SchoolEnrollmentService } from './services/school-enrollment-service.service';
import { StudentRecord } from './models/student-record.entity';
import { StudentRecordService } from './services/student-record.service';
import { StudentRecordFile } from './models/student-record-file.entity';
import { File } from './models/file.entity';
import { FilesService } from './services/files.service';
import { S3Service } from './services/s3.service';
import { StudentRecordFileService } from './services/student-record-file.service';
import { ResourceLevel } from './models/resource-level.entity';
import { TimezoneService } from './services/timezone.service';
import { PeriodService } from './services/period.service';
import { Period } from './models/period.entity';
import { Subject } from './models/subject.entity';
import { Provider } from './models/provider.entity';
import { Title } from './models/title.entity';
import { Course } from './models/course.entity';
import { Schedule } from './models/schedule.entity';
import { SchedulePeriod } from './models/schedule-period.entity';
import { ScheduleService } from './services/schedule.service';
import { ScheduleHistory } from './models/schedule-history.entity';
import { SchedulePeriodHistory } from './models/schedule-period-history.entity';
import { ProviderService } from './services/provider.service';
import { ReimbursementSetting } from './models/reimbursement-setting.entity';
import { HomeroomStudent } from './models/homeroom-student.entity';
import { Classes } from './models/classes.entity';
import { ResourceRequest } from './models/resource-request.entity';
import { DiplomaService } from './services/diploma.service';
import { DiplomaAnswerService } from './services/diploma-answer.service';
import { DiplomaQuestion } from './models/diploma-question.entity';
import { DiplomaAnswer } from './models/diploma-answer.entity';
import { StudentLearningLogService } from './services/student-learning-log.service';
import { StudentLearningLog } from './models/student-learning-log.entity';
import { StudentHomeroomService } from './services/student-homeroom.service';
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
  SchoolEnrollmentService,
  ResourceService,
  StudentRecordService,
  StudentRecordFileService,
  FilesService,
  S3Service,
  TimezoneService,
  PeriodService,
  ScheduleService,
  ProviderService,
  DiplomaService,
  DiplomaAnswerService,
  StudentLearningLogService,
  StudentHomeroomService,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Person,
      Student,
      Withdrawal,
      WithdrawalEmail,
      Parent,
      StudentGradeLevel,
      Phone,
      Address,
      SchoolYear,
      Application,
      Packet,
      EmailVerifier,
      StudentStatus,
      StudentRecord,
      StudentRecordFile,
      File,
      StudentStatusHistory,
      StudentReenrollmentStatus,
      UserRegion,
      Region,
      Resource,
      SchoolEnrollment,
      ResourceLevel,
      Period,
      Subject,
      Title,
      Provider,
      Course,
      Schedule,
      SchedulePeriod,
      ScheduleHistory,
      SchedulePeriodHistory,
      ReimbursementSetting,
      HomeroomStudent,
      Classes,
      ResourceRequest,
      DiplomaQuestion,
      DiplomaAnswer,
      StudentLearningLog,
    ]),
  ],
  providers: [...servicesImports],
  exports: [...servicesImports],
})
class RepoModule {}
export default RepoModule;
