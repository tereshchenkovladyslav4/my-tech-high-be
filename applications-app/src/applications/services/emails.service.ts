import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CoreSetting } from '../models/core-setting.entity';
import { CoreSettingsService } from './core-settings.service';
import { SESService } from './ses.service';
import { EmailInput } from './../dto/email.inputs';
import { User } from '../models/user.entity';
import { EmailVerifier } from '../models/email-verifier.entity';
import { ResponseDTO } from '../dto/response.dto';
import { EmailTemplatesService } from './email-templates.service';
import { UserRegionService } from './user-region.service';
import { ApplicationUserRegion } from '../models/user-region.entity';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';

var base64 = require('base-64');
@Injectable()
export class EmailsService {
  constructor(
    private coreSettingsService: CoreSettingsService,
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
    private userRegionService: UserRegionService,
  ) {}

  async sendAccountVerificationEmail(
    emailVerifier: EmailVerifier,
    emailInput: EmailInput,
  ): Promise<any> {
    let settings = [];
    const webAppUrl = process.env.WEB_APP_URL;

    const regions: ApplicationUserRegion[] =
      await this.userRegionService.findUserRegionByUserId(
        emailVerifier.user_id,
      );

    var region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate =
      await this.emailTemplateService.findByTemplateAndRegion(
        'Application Received',
        region_id,
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

  async sendAnnouncementEmail(announcementEmail: AnnouncementEmailArgs) {
    const { sender, subject, body, RegionId, filter_grades, filter_users } =
      announcementEmail;
    const userTypes = JSON.parse(filter_users); // 0: Admin, 1: Parents/Observers, 2: Students, 3: Teachers & Assistants
    const cond = userTypes
      .join(' OR ')
      .replace('0', 'role.name = "Admin"')
      .replace('1', 'role.name = "Parent" OR role.name = "Observer"')
      .replace('2', 'role.name = "Student"')
      .replace('3', 'role.name = "Teacher" OR role.name = "Teacher Assistant"');
    if (cond != '') {
      const queryRunner = await getConnection().createQueryRunner();
      const users = await queryRunner.query(
        `SELECT
          Users.email AS email,
          Users.user_id AS userId
        FROM (
          SELECT user_id, email, level FROM infocenter.core_users
        ) AS Users
        LEFT JOIN infocenter.user_region region ON (region.user_id = Users.user_id)
        LEFT JOIN infocenter.roles role ON (role.level = Users.level)
        WHERE
          region.region_id = ${RegionId} AND (${cond}) `,
      );
      queryRunner.release();
      users.forEach(async (user) => {
        if (user.email) {
          try {
            await this.sendEmail({
              email: user.email,
              subject,
              content: body,
              from: sender,
            });
          } catch (error) {
            console.log(error, 'Email Error');
          }
        }
      });
    }
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
