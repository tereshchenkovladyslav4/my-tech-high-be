import { ParentUserService } from './services/parent-user.service';
import { jwtConstants } from '../auth/Constants';
import { AuthService } from '../auth/service/auth.service';
import { UserAccessService } from './services/access/user-access.service';
import { AccessService } from './services/access/access.service';
import { Access } from '../models/access.entity';
import { UserAccess } from '../models/user-access.entity';
import { UserRegionService } from './services/region/user-region.service';
import { RegionService } from './services/region/region.service';
import { UserRegion } from '../models/user-region.entity';
import { Region } from '../models/region.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { UsersService } from './services/users.service';
import { Address } from '../models/address.entity';
import { PersonAddress } from '../models/person-address.entity';
import { Person } from '../models/person.entity';
import { Phone } from '../models/phone.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailTemplate } from 'src/models/email-template.entity';
import { EmailReminder } from 'src/models/email-reminder.entity';
import { EmailTemplatesService } from './services/email-templates/email-templates.service';
import { EmailReminderService } from './services/email-templates/email-reminder.service';
import { ParentUser } from '../models/parent.entity';
import { EmailCategoryService } from './services/email-templates/email-category.service';
import { EmailTemplateCategory } from 'src/models/email-template-category.entity';
import { EmailVerifier } from 'src/models/email-verifier.entity';
import { EmailsService } from './services/emails.service';
import { SESService } from './services/ses.service';
import { EmailVerifierService } from './services/email-verifier.service';
import { SchoolYearsService } from './services/schoolyear.service';
import { SchoolYear } from 'src/models/schoolyear.entity';
import { SchoolDistrictService } from './services/schoolDistrict.service';
import { SchoolDistrict } from 'src/models/school-district.entity';
const RepoServices = [
  UsersService,
  RegionService,
  SchoolDistrictService,
  UserRegionService,
  AccessService,
  UserAccessService,
  AuthService,
  ParentUserService,
  EmailTemplatesService,
  EmailReminderService,
  EmailCategoryService,
  EmailsService,
  SESService,
  EmailVerifierService,
  SchoolYearsService,
];

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([
      User,
      Region,
      UserRegion,
      Access,
      Person,
      Phone,
      Address,
      PersonAddress,
      UserAccess,
      ParentUser,
      EmailTemplate,
      EmailReminder,
      ParentUser,
      EmailTemplateCategory,
      EmailVerifier,
      SchoolYear,
      SchoolDistrict,
    ]),
  ],
  providers: RepoServices,
  exports: RepoServices,
})
class RepoModule {}
export default RepoModule;
