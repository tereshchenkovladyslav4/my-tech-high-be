import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SESService } from "./ses.service";
import { EmailVerifier } from "src/users/models/email-verifier.entity";
import { EmailTemplatesService } from "./email-templates.service";
var base64 = require("base-64");
import * as Moment from "moment";

@Injectable()
export class EmailsService {
  constructor(private SESService: SESService, private emailTemplateService: EmailTemplatesService) {}

  async sendAccountResetPasswordEmail(
    user_id: number,
    email: string,
    date_created: string = Moment().format("YYYY-MM-DD HH:mm:ss")
  ): Promise<any> {
    const template = await this.emailTemplateService.findByTemplate("Forgot Password");
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encrypt(user_id, email, date_created);
    const recipientEmail = email;
    let subject = "Reset Password";
    let content = "<p>Did you forget your password?</p>";
    content += "<p>That's okay, it happens!</p>";
    content +=
      "<p>Use the link to set up a new password for your account. if you did not request your password, ignore this email and the link will expire on its own</p>";
    content += '<p><a href="' + webAppUrl + "/reset-password/?token=" + token + '">Click here</a><br></p>';
    if (template) {
      content = template.body;
      content += '<p><a href="' + webAppUrl + "/reset-password/?token=" + token + '">Click here</a><br></p>';
      subject = template.subject;
    }
    return this.SESService.sendEmail(recipientEmail, subject, content, template.bcc, template.from);
  }

  encrypt(user_id, email, date_created) {
    return base64.encode(`${user_id}-${email}-${date_created}`);
  }
}
