/* eslint-disable @typescript-eslint/no-unused-vars*/
import { Injectable } from '@nestjs/common';
import { SESService } from './ses.service';
import { EmailInput } from '../dto/email.inputs';
import { User } from '../models/user.entity';
import { EmailVerifier } from '../models/email-verifier.entity';
import { ResponseDTO } from '../dto/response.dto';
import { EmailTemplatesService } from './email-templates.service';
import { UserRegionService } from './user-region.service';
import { UserRegion } from '../models/user-region.entity';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { UserAnnouncementsService } from './user-announcements.service';
import { UsersService } from './users.service';
import { EmailRecordsService } from './email-records.service';
import { EmailTemplateEnum } from '../enums';
import * as base64 from 'base-64';

@Injectable()
export class EmailsService {
  constructor(
    private sESService: SESService,
    private emailTemplateService: EmailTemplatesService,
    private userRegionService: UserRegionService,
    private userAnnouncementService: UserAnnouncementsService,
    private usersService: UsersService,
    private emailRecordsService: EmailRecordsService, //private announcementsService: AnnouncementsService,
  ) {}

  async sendAccountVerificationEmail(emailVerifier: EmailVerifier, emailInput: EmailInput): Promise<any> {
    const webAppUrl = process.env.WEB_APP_URL;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(emailVerifier.user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.EMAIL_VERIFICATION,
      region_id,
    );
    const token = this.encrypt(emailVerifier);
    const recipientEmail = emailInput.recipients || emailVerifier.email;
    const emailVerificationLink = webAppUrl + '/confirm/?token=' + token;
    const link = '<a href="' + emailVerificationLink + '">' + webAppUrl + '/confirm' + '</a>';

    let content = '';
    let subject = emailTemplate?.subject;

    if (emailTemplate) {
      const setEmailBodyInfo = (user) => {
        return emailTemplate.body
          .toString()
          .replace(/\[USER\]/g, user.firstName)
          .replace(/\[LINK\]/g, link);
      };

      const setEmailSubjectInfo = (user) => {
        return emailTemplate.subject
          .toString()
          .replace(/\[USER\]/g, user.firstName)
          .replace(/\[LINK\]/g, link);
      };

      const recipient: User = await this.usersService.findOneByEmail(recipientEmail);
      if (recipient) {
        content = setEmailBodyInfo(recipient);
        subject = setEmailSubjectInfo(recipient);
      }
    }

    const result = await this.sESService.sendEmail(
      recipientEmail,
      subject,
      content,
      emailTemplate?.bcc,
      emailTemplate?.from,
    );

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    await this.emailRecordsService.create({
      subject: subject,
      body: content,
      to_email: recipientEmail,
      from_email: emailTemplate?.from,
      template_name: EmailTemplateEnum.EMAIL_VERIFICATION,
      bcc: emailTemplate?.bcc,
      status: email_status,
      region_id: region_id,
    });

    return result;
  }

  async sendAnnouncementEmail(announcementEmail: AnnouncementEmailArgs) {
    const { user, body, sender, subject, announcementId } = announcementEmail;

    if (user.user_id) {
      const currUserAnnouncement = await this.userAnnouncementService.findById({
        announcementId,
        userId: user.user_id,
      });
      if (currUserAnnouncement) {
        await this.userAnnouncementService.save({
          AnnouncementId: announcementId,
          user_id: user.user_id,
          status: 'Unread',
          id: currUserAnnouncement.id,
        });
      } else {
        try {
          await this.sendEmail({
            email: user.email,
            subject,
            content: body,
            from: sender,
            template_name: EmailTemplateEnum.ANNOUNCEMENT,
          });
        } catch (error) {}
        await this.userAnnouncementService.save({
          AnnouncementId: announcementId,
          user_id: user.user_id,
          status: 'Unread',
        });
      }
    }
  }

  async sendEmail(emailInput: EmailInput): Promise<ResponseDTO> {
    const { email, subject, content, bcc, from, template_name, region_id } = emailInput;

    const result = await this.sESService.sendEmail(email, subject, content, bcc, from);

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    const emailRecord = await this.emailRecordsService.create({
      subject: subject,
      body: content,
      to_email: email,
      from_email: from,
      template_name: template_name,
      bcc: bcc,
      status: email_status,
      region_id: region_id,
    });

    return <ResponseDTO>{
      error: result,
      message: result == false ? 'Email Send Successfully' : 'Unexpected Error Occured',
      results: {
        emailRecordId: emailRecord.id,
      },
    };
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`);
  }
}
