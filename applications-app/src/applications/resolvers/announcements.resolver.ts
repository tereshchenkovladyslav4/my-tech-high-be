import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { Announcement } from '../models/announcement.entity';
import { AnnouncementsService } from '../services/announcements.service';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
@Resolver((of) => Announcement)
export class AnnouncementsResolver {
  constructor(private announcementsService: AnnouncementsService) {}

  @Query((returns) => [Announcement], { name: 'announcements' })
  //@UseGuards(new AuthGuard())
  async getAnnouncements(): Promise<Announcement[]> {
    return this.announcementsService.findAll();
  }

  @Mutation((returns) => Announcement, { name: 'createAnnoucement' })
  @UseGuards(new AuthGuard())
  async createAnnoucement(
    @Args('createAnnoucementInput')
    createAnnoucementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.create(createAnnoucementInput);
  }

  @Mutation((returns) => Announcement, { name: 'updateAnouncement' })
  @UseGuards(new AuthGuard())
  async updateAnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.update(updateAnnouncementInput);
  }
}
