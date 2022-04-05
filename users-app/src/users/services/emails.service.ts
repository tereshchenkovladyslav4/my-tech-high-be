import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SESService } from './ses.service';
import { EmailVerifier } from 'src/models/email-verifier.entity';
import { EmailTemplatesService } from './email-templates/email-templates.service';
var base64 = require('base-64');
@Injectable()
export class EmailsService {
  constructor(
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
  ) {}

  async sendAccountVerificationEmail(
    emailVerifier: EmailVerifier,
  ): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encrypt(emailVerifier);
    const recipientEmail = emailVerifier.email;
    const template = await this.emailTemplateService.findByTemplate(
      'Email Verification',
    );

    let subject =
      'Thank you for submitting an application to the My Tech High program test';
    let content =
      '<p>We have received your application to participate in the My Tech High program.</p>';
    content +=
      '<p>Please click on the link below to verify your email address and complete your account registration.</p>';
    content +=
      '<p><a href="' +
      webAppUrl +
      '/confirm/?token=' +
      token +
      '">Click here</a><br></p>';
    content +=
      '<p>*This is just a test, please disregard if you receive this email* - MTH</p>';
    content += ' <p>Â </p>';
    if (template) {
      content = template.body;
      content +=
        '<p><a href="' +
        webAppUrl +
        '/confirm/?token=' +
        token +
        '">Click here</a><br></p>';
      subject = template.subject;
    }
    return this.SESService.sendEmail(
      recipientEmail,
      subject,
      content,
      template.bcc,
      template.from,
    );
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(
      `${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`,
    );
  }
}
