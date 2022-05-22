import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getConnection } from 'typeorm';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { EmailsService } from './emails.service';
import * as Moment from 'moment';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(private sesEmailService: EmailsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async findScheduledAnnouncements() {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const announcements = await queryRunner.query(
        `SELECT
          announcement_id AS announcementId,
          posted_by AS sender,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
          schedule_time AS scheduleTime
        FROM infocenter.announcement
        WHERE
          status = 'Scheduled' AND
          schedule_time > NOW()`,
      );
      queryRunner.release();
      announcements.forEach(async (announcement) => {
        const {
          announcementId,
          sender,
          subject,
          body,
          scheduleTime,
          RegionId,
          filter_grades,
          filter_users,
        } = announcement;
        if (
          Moment(new Date()).format('yyyy-MM-DD HH:mm') ==
          Moment(scheduleTime).format('yyyy-MM-DD HH:mm')
        ) {
          await this.sendAnnouncementEmail({
            sender,
            subject,
            body,
            RegionId,
            filter_grades,
            filter_users,
          });
          const queryRunner = await getConnection().createQueryRunner();
          await queryRunner.query(
            `UPDATE infocenter.announcement SET status = 'Published' WHERE announcement_id = ${announcementId}`,
          );
          queryRunner.release();
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendAnnouncementEmail(announcementEmail: AnnouncementEmailArgs) {
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
  }
}
