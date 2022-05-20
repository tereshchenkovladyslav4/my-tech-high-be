import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../models/announcement.entity';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
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

  async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
    return this.announcementsRepository.save(announcement);
  }

  async update(
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    try {
      return await this.announcementsRepository.save(updateAnnouncementInput);
    } catch (error) {
      return error;
    }
  }
}
