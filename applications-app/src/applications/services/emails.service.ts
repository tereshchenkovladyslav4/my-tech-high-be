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
import { UserRegion } from '../models/user-region.entity';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { UserAnnouncementsService } from './user-announcements.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { PersonsService } from './persons.service';
import { StudentsService } from './students.service';
import { UsersService } from './users.service';
import { SchoolYearService } from './schoolyear.service';
import { EmailRecordsService } from './email-records.service';
//import { AnnouncementsService } from './announcements.service';

const base64 = require('base-64');
@Injectable()
export class EmailsService {
  constructor(
    private coreSettingsService: CoreSettingsService,
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
    private userRegionService: UserRegionService,
    private userAnnouncementService: UserAnnouncementsService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private schoolYearService: SchoolYearService,
    private emailRecordsService: EmailRecordsService, //private announcementsService: AnnouncementsService,
  ) {}

  async sendAccountVerificationEmail(
    emailVerifier: EmailVerifier,
    emailInput: EmailInput,
    parent_id: number,
    students: any,
  ): Promise<any> {
    const settings = [];
    const webAppUrl = process.env.WEB_APP_URL;

    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(emailVerifier.user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion('Email Verification', region_id);

    // const siteSettings = this.coreSettingsService.getSiteSettings();

    // (await siteSettings).map( coreSetting => {
    //     settings[coreSetting.name] = coreSetting;
    //     return coreSetting;
    // } );
    const token = this.encrypt(emailVerifier);
    // console.log( "settings: ", settings );
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

    const result = await this.SESService.sendEmail(
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
      template_name: 'Email Verification',
      bcc: emailTemplate?.bcc,
      status: email_status,
      region_id: region_id,
    });

    return result;
  }

  //async sendAnnouncementEmail2(
  //  announcementEmail: AnnouncementEmailArgs,
  //  users,
  //) {
  //  const { announcement_id, sender, subject, body } = announcementEmail;
  //  users.map(async (user) => {

  //    if (user.UserId) {
  //      const currUserAnnouncement =
  //        await this.userAnnouncementService.findById({
  //          announcementId: announcement_id,
  //          userId: user.UserId,
  //        });
  //      if (currUserAnnouncement) {
  //        await this.userAnnouncementService.save({
  //          AnnouncementId: announcement_id,
  //          user_id: user.UserId,
  //          status: 'Unread',
  //          id: currUserAnnouncement.id,
  //        });
  //      } else {
  //        try {
  //          await this.sendEmail({
  //            email: user.email,
  //            subject,
  //            content: body,
  //            from: sender,
  //          });
  //        } catch (error) {
  //          console.log(error, 'Email Error');
  //        }
  //        await this.userAnnouncementService.save({
  //          AnnouncementId: announcement_id,
  //          user_id: user.UserId,
  //          status: 'Unread',
  //        });
  //      }
  //    }
  //  });
  //}

  // async sendAnnouncementEmail2(announcementEmail: AnnouncementEmailArgs) {
  //   const { announcement_id, sender, subject, body } = announcementEmail;

  //   const users = await this.announcementsService.getAnnouncementUsersByFilters(
  //     announcementEmail,
  //   );

  //   users.map(async (user) => {
  //     if (user.UserId) {
  //       const currUserAnnouncement =
  //         await this.userAnnouncementService.findById({
  //           announcementId: announcement_id,
  //           userId: user.UserId,
  //         });
  //       if (currUserAnnouncement) {
  //         await this.userAnnouncementService.save({
  //           AnnouncementId: announcement_id,
  //           user_id: user.UserId,
  //           status: 'Unread',
  //           id: currUserAnnouncement.id,
  //         });
  //       } else {
  //         try {
  //           await this.sendEmail({
  //             email: user.email,
  //             subject,
  //             content: body,
  //             from: sender,
  //           });
  //         } catch (error) {
  //           console.log(error, 'Email Error');
  //         }
  //         await this.userAnnouncementService.save({
  //           AnnouncementId: announcement_id,
  //           user_id: user.UserId,
  //           status: 'Unread',
  //         });
  //       }
  //     }
  //   });
  // }

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
          });
        } catch (error) {
          console.log(error, 'Email Error');
        }
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

    const result = await this.SESService.sendEmail(email, subject, content, bcc, from);

    const email_status = result == false ? 'Sent' : 'Error';

    // Add Email Records
    await this.emailRecordsService.create({
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
    };
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(`${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`);
  }
}
