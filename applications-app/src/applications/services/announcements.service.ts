import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Announcement } from '../models/announcement.entity';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { EmailsService } from './emails.service';
import { CronJobService } from './cronJob.service';
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private sesEmailService: EmailsService,
    private cronJobService: CronJobService,
  ) {}

  async findAll(): Promise<Array<Announcement>> {
    try {
      const results = await this.announcementsRepository
        .createQueryBuilder('announcement')
        .leftJoinAndSelect('announcement.User', 'user')
        .getMany();
      return results;
    } catch (error) {
      return [];
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

  async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
    if (announcement.status == 'Published') {
      const { sender, subject, body, RegionId, filter_grades, filter_users } =
        announcement;
      await this.sendAnnouncementEmail({
        sender,
        subject,
        body,
        RegionId,
        filter_grades,
        filter_users,
      });
    } else if (announcement.status == 'Scheduled') {
      const now = new Date();
      this.cronJobService.addTimeout(now.getTime().toString(), announcement);
    }
    return this.announcementsRepository.save(announcement);
  }

  async update(
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    try {
      if (updateAnnouncementInput.status == 'Published') {
        const { sender, subject, body, RegionId, filter_grades, filter_users } =
          updateAnnouncementInput;
        await this.sendAnnouncementEmail({
          sender,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        });
      } else if (updateAnnouncementInput.status == 'Scheduled') {
        const now = new Date();
        this.cronJobService.addTimeout(
          now.getTime().toString(),
          updateAnnouncementInput,
        );
      }
      Object.keys(updateAnnouncementInput).forEach((key) => {
        if (!updateAnnouncementInput[key]) {
          delete updateAnnouncementInput[key];
        }
      });
      return await this.announcementsRepository.save(updateAnnouncementInput);
    } catch (error) {
      return error;
    }
  }
}
