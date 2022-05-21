import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CronJob } from 'cron';
import { getConnection } from 'typeorm';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { Announcement } from '../models/announcement.entity';
import { Application } from '../models/application.entity';
import { AnnouncementsService } from './announcements.service';
import { EmailsService } from './emails.service';

@Injectable()
export class CronJobService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sesEmailService: EmailsService,
  ) {}

  async sendAnnouncementEmail(
    announcementEmail: AnnouncementEmailArgs,
    name: string,
  ) {
    const { sender, subject, body, RegionId, filter_grades, filter_users } =
      announcementEmail;
    const userTypes = JSON.parse(filter_users); // 0: Admin, 1: Parents/Observers, 2: Students, 3: Teachers & Assistants
    userTypes.forEach(async (userType) => {
      const cond =
        userType == 0
          ? 'role.name = "Admin"'
          : userType == 1
          ? 'role.name = "Parent" OR role.name = "Observer"'
          : userType == 2
          ? "role.name = 'Student'"
          : userType == 3
          ? "role.name = 'Teacher' OR role.name = 'Teacher Assistant'"
          : 'role.name = "Admin"';
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
          await this.sesEmailService.sendEmail({
            email: user.email,
            subject,
            content: body,
            from: sender,
          });
        }
      });
    });
    this.deleteTimeout(name);
  }

  // addCronJob(name: string, announcement: CreateAnnouncementInput) {
  //   const { cronJobTime } = announcement;
  //   console.log(
  //     `0 ${cronJobTime} *`,
  //     'cronJobTime---------------------------------------------',
  //     new Date(),
  //   );
  //   const job = new CronJob(`0 ${cronJobTime} *`, async () => {
  //     console.log('Start CronJob', announcement);
  //     const { sender, subject, body, RegionId, filter_grades, filter_users } =
  //       announcement;
  //     await this.sendAnnouncementEmail({
  //       sender,
  //       subject,
  //       body,
  //       RegionId,
  //       filter_grades,
  //       filter_users,
  //     });
  //   });

  //   this.schedulerRegistry.addCronJob(`${name} ${cronJobTime}`, job);
  //   job.start();
  //   console.log('job Start');
  // }

  addTimeout(name: string, announcement: CreateAnnouncementInput) {
    const { cronJobTime } = announcement;
    const callback = async () => {
      const { sender, subject, body, RegionId, filter_grades, filter_users } =
        announcement;
      await this.sendAnnouncementEmail(
        {
          sender,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        },
        name,
      );
    };

    const timeout = setTimeout(callback, parseInt(cronJobTime));
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  deleteTimeout(name: string) {
    this.schedulerRegistry.deleteTimeout(name);
  }
}
