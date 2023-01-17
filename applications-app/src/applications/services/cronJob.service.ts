import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getConnection } from 'typeorm';
import { EmailsService } from './emails.service';
import { EnrollmentsService } from '../enrollments.service';
import { WithdrawalService } from './withdrawal.service';
import { CronJobsLogsService } from './cron-jobs-logs.services';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from '../models/announcement.entity';
import { ScheduleService } from './schedule.service';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private sesEmailService: EmailsService,
    private enrollmentsService: EnrollmentsService,
    private withdrawalsService: WithdrawalService,
    private cronJobsLogsSevice: CronJobsLogsService,
    private announcementsService: AnnouncementsService,
    private scheduleServices: ScheduleService,
  ) {}

  //async findScheduledAnnouncements2() {
  //  try {
  //    const queryRunner = await getConnection().createQueryRunner();
  //    const announcements = await queryRunner.query(
  //      `SELECT
  //        announcement_id AS announcementId,
  //        posted_by AS sender,
  //        subject,
  //        body,
  //        RegionId,
  //        filter_grades,
  //        filter_users,
  //        filter_program_years,
  //        filter_school_partners,
  //        schedule_time AS scheduleTime
  //      FROM infocenter.announcement
  //      WHERE
  //      status = 'Scheduled' AND
  //        isArchived <> 1 AND
  //        SUBSTR(schedule_time, 1, 16) = SUBSTR(NOW(), 1, 16)`,
  //    );
  //    queryRunner.release();
  //    announcements.map(async (announcement) => {
  //      const {
  //        announcementId,
  //        sender,
  //        subject,
  //        body,
  //        RegionId,
  //        filter_grades,
  //        filter_users,
  //      } = announcement;

  //      const users =
  //        await this.announcementsService.getAnnouncementUsersByFilters(
  //          announcement,
  //        );

  //      console.log('Users: ', users);

  //      await this.sesEmailService.sendAnnouncementEmail2(
  //        {
  //          announcement_id: announcementId,
  //          sender,
  //          subject,
  //          body,
  //          RegionId,
  //          filter_grades,
  //          filter_users,
  //        },
  //        users,
  //      );
  //      const queryRunner = await getConnection().createQueryRunner();
  //      await queryRunner.query(
  //        `UPDATE infocenter.announcement SET status = 'Published' WHERE announcement_id = ${announcementId}`,
  //      );
  //      queryRunner.release();
  //    });
  //    this.logger.log('announcements: ', announcements);
  //    if (announcements.length > 0) {
  //      this.cronJobsLogsSevice.save({
  //        function_name: 'findScheduledAnnouncements',
  //        log: JSON.stringify({ result: announcements }),
  //        type: 'success',
  //      });
  //    }
  //  } catch (error) {
  //    this.logger.error(error);
  //    this.cronJobsLogsSevice.save({
  //      function_name: 'findScheduledAnnouncements',
  //      log: JSON.stringify({ result: error }),
  //      type: 'error',
  //    });
  //  }
  //}

  @Cron(CronExpression.EVERY_MINUTE)
  async findScheduledAnnouncements() {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const announcements: Announcement[] = await queryRunner.query(
        `SELECT
          announcement_id,
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
          filter_others,
          filter_providers,
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
          announcement_id,
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
          filter_others,
          filter_providers,
        } = announcement;

        const userEmailList = await this.announcementsService.getAnnouncementUsersByFilters({
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
          filter_others,
          filter_providers,
        });
        userEmailList.map(async (user) => {
          await this.sesEmailService.sendAnnouncementEmail({
            body,
            subject,
            sender: posted_by,
            user,
            announcementId: announcement_id,
          });
        });
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.query(
          `UPDATE infocenter.announcement SET status = 'Published' WHERE announcement_id = ${announcement_id}`,
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
  @Cron('0 0 5 * * *', {
    name: 'emailreminders',
    timeZone: 'America/Phoenix',
  }) // Runs Every 5am Everyday MST
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

  @Cron('0 0 0 * * *') // Runs Every day at Midnight
  //@Cron(CronExpression.EVERY_30_SECONDS)
  async scheduleSecondSemesterUnlocked() {
    try {
      const data = await this.scheduleServices.runSecondSemesterUnlocked();
      this.logger.log('scheduleSecondSemesterUnlocked: ', data);
      this.cronJobsLogsSevice.save({
        function_name: 'scheduleSecondSemesterUnlocked',
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
        function_name: 'scheduleSecondSemesterUnlocked',
        log: JSON.stringify({ result: error }),
        type: 'error',
      });
    }
  }
}
