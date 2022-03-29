import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreSetting } from '../models/core-setting.entity';
import { CoreSettingsService } from './core-settings.service';
import { SESService } from './ses.service';
import { EmailInput } from './../dto/email.inputs';
import { User } from '../models/user.entity';
import { EmailVerifier } from '../models/email-verifier.entity';
import { ResponseDTO } from '../dto/response.dto';
import { EmailTemplatesService } from './email-templates.service';
var base64 = require('base-64');
@Injectable()
export class EmailsService {
  constructor(
    private coreSettingsService: CoreSettingsService,
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
  ) {}

  async sendAccountVerificationEmail(
    emailVerifier: EmailVerifier,
    emailInput: EmailInput,
  ): Promise<any> {
    let settings = [];
    const webAppUrl = process.env.WEB_APP_URL;
    const emailTemplate = await this.emailTemplateService.findByTemplate(
      'Application Received',
    );

    // const siteSettings = this.coreSettingsService.getSiteSettings();

    // (await siteSettings).map( coreSetting => {
    //     settings[coreSetting.name] = coreSetting;
    //     return coreSetting;
    // } );
    const token = this.encrypt(emailVerifier);
    // console.log( "settings: ", settings );
    const recipientEmail = emailVerifier.email;
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

    if (emailTemplate) {
      subject = emailTemplate.subject;
      content = emailTemplate.body;
      content +=
        '<p>Please click on the link below to verify your email address and complete your account registration.</p>';
      content +=
        '<p><a href="' +
        webAppUrl +
        '/confirm/?token=' +
        token +
        '">Click here</a><br></p>';
    }
    return this.SESService.sendEmail(
      recipientEmail,
      subject,
      content,
      emailTemplate?.bcc,
      emailTemplate?.from,
    );
  }

  async sendEmail(emailInput: EmailInput): Promise<ResponseDTO> {
    const { email, subject, content, bcc, from } = emailInput;

    this.SESService.sendEmail(email, subject, content, bcc, from);

    return <ResponseDTO>{
      error: false,
      message: 'Email Send Successfully',
    };
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(
      `${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`,
    );
  }
}
