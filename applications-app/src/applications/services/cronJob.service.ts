import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getConnection } from 'typeorm';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { EmailsService } from './emails.service';
import { EnrollmentsService } from '../enrollments.service';
import * as Moment from 'moment';
import { WithdrawalService } from './withdrawal.service';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private sesEmailService: EmailsService,
    private enrollmentsService: EnrollmentsService,
    private withdrawalsService: WithdrawalService,
  ) {}

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
          isArchived <> 1 AND
          SUBSTR(schedule_time, 1, 16) = SUBSTR(NOW(), 1, 16)`,
      );
      queryRunner.release();
      announcements.map(async (announcement) => {
        const {
          announcementId,
          sender,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        } = announcement;
        await this.sesEmailService.sendAnnouncementEmail({
          announcement_id: announcementId,
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
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  //@Cron(CronExpression.EVERY_30_SECONDS)
  @Cron('0 0 0 * * *') // Runs Every day at Midnight
  async schedulePacketReminders() {
    try {
      const data = await this.enrollmentsService.runScheduleReminders();
      this.logger.log('scheduledPacketReminders: ', data);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
        }),
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Cron('0 0 0 * * *') // Runs Every day at Midnight
  //@Cron(CronExpression.EVERY_30_SECONDS)
  async scheduleWithdrawalReminders() {
    try {
      const data = await this.withdrawalsService.runScheduleReminders();
      this.logger.log('scheduledWithdrawalReminders: ', data);
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
        }),
      };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
