import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./models/user.entity";
import { MePermission } from "./models/me-permission.entity";
import { UsersService } from "./services/users.service";
import { EmailVerifierService } from "./services/email-verifier.service";
import { EmailVerifier } from "./models/email-verifier.entity";
import { EmailTemplate } from "./models/email-template.entity";
import { EmailTemplatesService } from "./services/email-templates.service";
import { EmailsService } from "./services/emails.service";
import { SESService } from "./services/ses.service";
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, EmailVerifier, EmailTemplate])],
  providers: [UsersService, EmailVerifierService, EmailTemplatesService, EmailsService, SESService],
  exports: [UsersService, EmailVerifierService, EmailTemplatesService, EmailsService, SESService],
})
class RepoModule {}
export default RepoModule;
