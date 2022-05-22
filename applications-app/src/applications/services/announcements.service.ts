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
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
    try {
      if (announcement.status == 'Published') {
        const {
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        } = announcement;
        await this.sesEmailService.sendAnnouncementEmail({
          sender: posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        });
      }
      return this.announcementsRepository.save(announcement);
    } catch (error) {
      return error;
    }
  }

  async update(
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    try {
      if (updateAnnouncementInput.status == 'Published') {
        const {
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        } = updateAnnouncementInput;
        await this.sesEmailService.sendAnnouncementEmail({
          sender: posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        });
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
