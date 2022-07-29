import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Announcement } from '../models/announcement.entity';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { ResponseDTO } from '../dto/response.dto';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { EmailsService } from './emails.service';
import { CronJobService } from './cronJob.service';
import { difference } from 'lodash';
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private sesEmailService: EmailsService,
    private cronJobService: CronJobService,
  ) { }

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
      if (announcement.status == 'Published' && !announcement.isArchived) {
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
    const {
      announcement_id,
      posted_by,
      subject,
      body,
      RegionId,
      filter_grades,
      filter_users,
      status,
      isArchived
    } = updateAnnouncementInput;
    const announcementData = await this.announcementsRepository.findOne({announcement_id})
    if(announcementData){
      try {
        if (
          (status == 'Published' && !isArchived)
          || (status === 'Republished')
        ) {
          const parsedGradeFilter: string[] = JSON.parse(filter_grades),
            parsedUserFilter: string[] = JSON.parse(filter_users),
            currParsedAnnouncementUserFilter = JSON.parse(announcementData.filter_users),
            currParsedAnnouncementGradeFilter = JSON.parse(announcementData.filter_grades),
            parsedGrades = difference(parsedGradeFilter, currParsedAnnouncementGradeFilter),
            parsedUsers = difference(parsedUserFilter, currParsedAnnouncementUserFilter)
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
        return await this.announcementsRepository.save({
          ...updateAnnouncementInput, 
          status: status === 'Republished' ? 'Published' : status
        });
      } catch (error) {
        return error;
      }
    }
  }

  async deleteById(id: number): Promise<ResponseDTO> {
    try {
      await this.announcementsRepository.delete({ announcement_id: id });
      return <ResponseDTO>{
        error: false,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return <ResponseDTO>{
        error: true,
        message: 'Delete Failed',
      };
    }
  }
}
