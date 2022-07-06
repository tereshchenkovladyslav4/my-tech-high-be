import { Args, Query, Resolver, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { Announcement } from '../models/announcement.entity';
import { AnnouncementsService } from '../services/announcements.service';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
import { UserAnnouncementsService } from '../services/user-announcements.service';
import { UserAnnouncementResponse } from '../dto/user-announcement.response';
import { ResponseDTO } from '../dto/response.dto';
import { UserAnnouncementRequestParams } from '../dto/user-announcement-request-param';
@Resolver((of) => Announcement)
export class AnnouncementsResolver {
  constructor(
    private announcementsService: AnnouncementsService,
    private userAnnouncementService: UserAnnouncementsService,
  ) {}

  @Query((returns) => [Announcement], { name: 'announcements' })
  @UseGuards(new AuthGuard())
  async getAnnouncements(
    @Args('region_id', { type: () => Int }) region_id: number,
  ): Promise<Announcement[]> {
    return this.announcementsService.findAll(region_id);
  }

  @Query((returns) => [UserAnnouncementResponse], { name: 'userAnnouncements' })
  @UseGuards(new AuthGuard())
  async getUserAnnouncements(
    @Args('request') request: UserAnnouncementRequestParams,
  ): Promise<UserAnnouncementResponse[]> {
    return this.userAnnouncementService.findAll(request);
  }

  @Mutation((returns) => ResponseDTO)
  deleteUserAnnouncementsByUserId(
    @Args('user_id', { type: () => Int }) user_id: number,
  ): Promise<ResponseDTO> {
    return this.userAnnouncementService.deleteAll(user_id);
  }

  @Mutation((returns) => ResponseDTO)
  deleteUserAnnouncementById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ResponseDTO> {
    return this.userAnnouncementService.deleteById(id);
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
