import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { UsersService } from './services/users.service';
import { EmailVerifierService } from './services/email-verifier.service';
import { EmailVerifier } from './models/email-verifier.entity';
import { EmailTemplate } from './models/email-template.entity';
import { UserRegion } from './models/user-region.entity';
import { EmailTemplatesService } from './services/email-templates.service';
import { EmailsService } from './services/emails.service';
import { SESService } from './services/ses.service';
import { UserRegionService } from './services/user-region.service';
import { EmailRecordsService } from './services/email-records.service';
import { EmailRecord } from './models/email-record.entity';
import { SchoolYearsService } from './services/schoolyear.service';
import { SchoolYear } from './models/schoolyear.entity';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerifier, EmailTemplate, UserRegion, EmailRecord, SchoolYear])],
  providers: [
    UsersService,
    EmailVerifierService,
    EmailTemplatesService,
    EmailsService,
    SESService,
    UserRegionService,
    EmailRecordsService,
    SchoolYearsService,
  ],
  exports: [
    UsersService,
    EmailVerifierService,
    EmailTemplatesService,
    EmailsService,
    SESService,
    UserRegionService,
    EmailRecordsService,
    SchoolYearsService,
  ],
})
class RepoModule {}
export default RepoModule;
