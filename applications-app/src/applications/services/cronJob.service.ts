import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { getConnection } from 'typeorm';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { EmailsService } from './emails.service';
import { EnrollmentsService } from '../enrollments.service';
import * as Moment from 'moment';
import { WithdrawalService } from './withdrawal.service';
import { CronJobsLogsService } from './cron-jobs-logs.services';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private sesEmailService: EmailsService,
    private enrollmentsService: EnrollmentsService,
    private withdrawalsService: WithdrawalService,
    private cronJobsLogsSevice: CronJobsLogsService,
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
      this.logger.log('announcements: ', announcements);
      if (announcements.length > 0) {
        this.cronJobsLogsSevice.save({
          function_name: 'findScheduledAnnouncements',
          log: JSON.stringify({ result: announcements }),
          type: 'success',
        });
      }
    } catch (error) {
      this.logger.error(error);
      this.cronJobsLogsSevice.save({
        function_name: 'findScheduledAnnouncements',
        log: JSON.stringify({ result: error }),
        type: 'error',
      });
    }
  }

  //@Cron(CronExpression.EVERY_30_SECONDS)
  @Cron('0 0 0 * * *') // Runs Every day at Midnight
  async schedulePacketReminders() {
    try {
      const data = await this.enrollmentsService.runScheduleReminders();
      this.logger.log('scheduledPacketReminders: ', data);
      this.cronJobsLogsSevice.save({
        function_name: 'schedulePacketReminders',
        log: JSON.stringify({ result: data }),
        type: 'success',
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
        }),
      };
    } catch (error) {
      this.logger.error(error);
      this.cronJobsLogsSevice.save({
        function_name: 'schedulePacketReminders',
        log: JSON.stringify({ result: error }),
        type: 'error',
      });
    }
  }

  @Cron('0 0 0 * * *') // Runs Every day at Midnight
  //@Cron(CronExpression.EVERY_30_SECONDS)
  async scheduleWithdrawalReminders() {
    try {
      const data = await this.withdrawalsService.runScheduleReminders();
      this.logger.log('scheduledWithdrawalReminders: ', data);
      this.cronJobsLogsSevice.save({
        function_name: 'scheduleWithdrawalReminders',
        log: JSON.stringify({ result: data }),
        type: 'success',
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
        }),
      };
    } catch (error) {
      this.logger.error(error);
      this.cronJobsLogsSevice.save({
        function_name: 'scheduleWithdrawalReminders',
        log: JSON.stringify({ result: error }),
        type: 'error',
      });
    }
  }
}
