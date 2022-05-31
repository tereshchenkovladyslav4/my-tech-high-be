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

  async findAll(region_id: number): Promise<Array<Announcement>> {
    try {
      const results = await this.announcementsRepository
        .createQueryBuilder('announcement')
        .where({ RegionId: region_id })
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
    try {
      const result = await this.announcementsRepository.save(announcement);
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
          announcement_id: result.announcement_id,
          sender: posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async update(
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    try {
      Object.keys(updateAnnouncementInput).forEach((key) => {
        if (!updateAnnouncementInput[key]) {
          delete updateAnnouncementInput[key];
        }
      });
      if (updateAnnouncementInput.status == 'Published') {
        const {
          announcement_id,
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        } = updateAnnouncementInput;
        await this.sesEmailService.sendAnnouncementEmail({
          announcement_id: announcement_id,
          sender: posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
        });
      }
      return await this.announcementsRepository.save(updateAnnouncementInput);
    } catch (error) {
      return error;
    }
  }
}
