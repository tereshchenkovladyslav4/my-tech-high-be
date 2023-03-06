/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { SESService } from './ses.service';
import { EmailVerifier } from 'src/models/email-verifier.entity';
import { EmailTemplatesService } from './email-templates/email-templates.service';
import { UserRegionService } from './region/user-region.service';
import { UserRegion } from 'src/models/user-region.entity';
import { User } from 'src/models/user.entity';
import { EmailRecordsService } from './email-records.service';
import { getConnection } from 'typeorm';
import { EmailTemplateEnum } from 'src/enums';
import * as base64 from 'base-64';
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

  async sendAccountVerificationEmail(emailVerifier: EmailVerifier): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encrypt(emailVerifier);
    const recipientEmail = emailVerifier.email;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(emailVerifier.user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const template = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.EMAIL_VERIFICATION,
      region_id,
    );

    let subject = 'Thank you for submitting an application to the My Tech High program test';
    let content = '<p>We have received your application to participate in the My Tech High program.</p>';

    const queryRunner = await getConnection().createQueryRunner();
    const response = (await queryRunner.query(
      `SELECT first_name FROM infocenter.core_users WHERE user_id = ${emailVerifier.user_id}`,
    )) as User[];
    queryRunner.release();

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

  async sendEmailUpdateVerificationEmail(emailVerifier: EmailVerifier): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const token = this.encrypt(emailVerifier);
    const recipientEmail = emailVerifier.email;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(emailVerifier.user_id);

    const queryRunner = await getConnection().createQueryRunner();
    const response = (await queryRunner.query(
      `SELECT first_name FROM infocenter.core_users WHERE user_id = ${emailVerifier.user_id}`,
    )) as User[];
    queryRunner.release();

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const currentSchoolYear = await this.schoolYearsService.getCurrentSchoolYearByRegion(region_id);

    const template = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.EMAIL_CHANGED,
      region_id,
      currentSchoolYear.school_year_id,
      false,
    );

    let subject = 'Email Change';
    let content = '<p>Please click on the link below to verify your new email address.</p>';

    if (template && response.length > 0) {
      content = template.body.toString();
      content = content.replace('[USER]', response[0].first_name);
      content = content.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/email-verification/?token=${token}">${webAppUrl}/email-verification</a><br></p>`,
      );
      subject = template.subject.toString();
      subject = subject.replace('[USER]', response[0].first_name);
      subject = subject.replace(
        '[LINK]',
        `<p><a href="${webAppUrl}/email-verification/?token=${token}">${webAppUrl}/email-verification</a><br></p>`,
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
      template_name: 'Email Changed',
      bcc: template?.bcc,
      status: email_status,
      region_id: region_id,
    });

    return result;
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`);
  }
}
