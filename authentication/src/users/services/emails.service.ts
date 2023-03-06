/* eslint-disable @typescript-eslint/no-unused-vars*/
import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { SESService } from './ses.service';
import { EmailVerifier } from 'src/users/models/email-verifier.entity';
import { EmailTemplatesService } from './email-templates.service';
import { UserRegionService } from './user-region.service';
import { EmailRecordsService } from './email-records.service';
import { UserRegion } from './../models/user-region.entity';
import { User } from '../models/user.entity';

import * as base64 from 'base-64';
import * as Moment from 'moment';
import { SchoolYearsService } from './schoolyear.service';

@Injectable()
export class EmailsService {
  constructor(
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
    private userRegionService: UserRegionService,
    private emailRecordsService: EmailRecordsService,
    private schoolYearsService: SchoolYearsService,
  ) {}

  async sendAccountResetPasswordEmail(
    user_id: number,
    email: string,
    date_created: string = Moment().format('YYYY-MM-DD HH:mm:ss'),
  ): Promise<any> {
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const currentSchoolYear = await this.schoolYearsService.getCurrentSchoolYearByRegion(region_id);

    const template = await this.emailTemplateService.findByTemplateSchoolYear(
      'Forgot Password',
      region_id,
      currentSchoolYear.school_year_id,
      false,
    );

    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encrypt(user_id, email, date_created);
    const recipientEmail = email;
    const queryRunner = await getConnection().createQueryRunner();
    const response = (await queryRunner.query(
      `SELECT level, first_name FROM infocenter.core_users WHERE email = '${recipientEmail}'`,
    )) as User[];
    queryRunner.release();

    let subject = 'Reset Password';
    let content = '<p>Did you forget your password?</p>';

    if (template && response.length > 0) {
      content = template.body.toString();
      content = content.replace('[USER]', response[0].first_name);
      content = content.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/reset-password/?token=${token}">${webAppUrl}/reset-password</a><br></p>`,
      );
      subject = template.subject.toString();
      subject = subject.replace('[USER]', response[0].first_name);
      subject = subject.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/reset-password/?token=${token}">${webAppUrl}/reset-password</a><br></p>`,
      );
    }
    const result = await this.SESService.sendEmail(recipientEmail, subject, content, template?.bcc, template?.from);

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    await this.emailRecordsService.create({
      subject: subject,
      body: content,
      to_email: recipientEmail,
      from_email: template?.from,
      template_name: 'Forgot Password',
      bcc: template?.bcc,
      status: email_status,
      region_id: region_id,
    });

    return result;
  }

  async sendAccountVerificationEmail(emailVerifier: EmailVerifier): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encryptEmailVerifier(emailVerifier);
    const recipientEmail = emailVerifier.email;
    const template = await this.emailTemplateService.findByTemplate('Email Verification');

    let subject = 'Thank you for submitting an application to the My Tech High program test';
    let content = '<p>We have received your application to participate in the My Tech High program.</p>';
    content +=
      '<p>Please click on the link below to verify your email address and complete your account registration.</p>';
    content += '<p><a href="' + webAppUrl + '/confirm/?token=' + token + '">Click here</a><br></p>';
    content += '<p>*This is just a test, please disregard if you receive this email* - MTH</p>';
    content += ' <p>Â </p>';
    if (template) {
      content = template.body;
      content += '<p><a href="' + webAppUrl + '/confirm/?token=' + token + '">Click here</a><br></p>';
      subject = template.subject;
    }
    const result = await this.SESService.sendEmail(recipientEmail, subject, content, template.bcc, template.from);

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    await this.emailRecordsService.create({
      subject: subject,
      body: content,
      to_email: recipientEmail,
      from_email: template?.from,
      template_name: 'Email Verification',
      bcc: template?.bcc,
      status: email_status,
      region_id: 1,
    });

    return result;
  }

  async sendEmailUpdateVerificationEmail(emailVerifier: EmailVerifier): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encryptEmailVerifier(emailVerifier);
    const recipientEmail = emailVerifier.email;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(emailVerifier.user_id);
    const queryRunner = await getConnection().createQueryRunner();
    const response = (await queryRunner.query(
      `SELECT level, first_name FROM infocenter.core_users WHERE user_id = ${emailVerifier.user_id}`,
    )) as User[];
    queryRunner.release();

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }
    const template = await this.emailTemplateService.findByTemplateAndRegion('Email Verification', region_id);

    let subject = 'Email Change';
    let content = '';

    if (template) {
      content = template.body.toString();

      content = content.replace('[USER]', response[0].first_name);
      content = content.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/confirm/?token=${token}">${webAppUrl}/confirm</a><br></p>`,
      );

      subject = template.subject.toString();
      subject = subject.replace('[USER]', response[0].first_name);
      subject = subject.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/confirm/?token=${token}">${webAppUrl}/confirm</a><br></p>`,
      );
    }
    const result = await this.SESService.sendEmail(recipientEmail, subject, content, template?.bcc, template?.from);

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    await this.emailRecordsService.create({
      subject: subject,
      body: content,
      to_email: recipientEmail,
      from_email: template?.from,
      template_name: 'Email Verification',
      bcc: template?.bcc,
      status: email_status,
      region_id: region_id,
    });

    return result;
  }

  encryptEmailVerifier(emailVerifier: EmailVerifier) {
    return base64.encode(`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`);
  }

  encrypt(user_id, email, date_created) {
    return base64.encode(`${user_id}-${email}-${date_created}`);
  }
}
