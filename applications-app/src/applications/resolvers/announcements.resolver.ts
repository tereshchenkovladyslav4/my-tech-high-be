import { Args, Query, Resolver, Mutation, Int, ID } from '@nestjs/graphql';
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
import { UserAnnouncement } from '../models/user-announcement.entity';
import { GetAnnouncementParams } from '../dto/get-announcement-params';
@Resolver(() => Announcement)
export class AnnouncementsResolver {
  constructor(
    private announcementsService: AnnouncementsService,
    private userAnnouncementService: UserAnnouncementsService,
  ) {}

  @Query(() => [Announcement], { name: 'announcements' })
  @UseGuards(new AuthGuard())
  async getAnnouncements(
    @Args('getAnnouncementParams') getAnnouncementParams: GetAnnouncementParams,
  ): Promise<Announcement[]> {
    return this.announcementsService.findAll(getAnnouncementParams);
  }

  @Query(() => Announcement, { name: 'announcement' })
  @UseGuards(new AuthGuard())
  async getAnnouncement(
    @Args({ name: 'announcement_id', type: () => ID }) announcement_id: number,
  ): Promise<Announcement> {
    return this.announcementsService.findOneById(announcement_id);
  }

  @Mutation(() => ResponseDTO)
  deleteAnnouncementsById(@Args('id', { type: () => Int }) id: number): Promise<ResponseDTO> {
    return this.announcementsService.deleteById(id);
  }

  @Query(() => [UserAnnouncementResponse], { name: 'userAnnouncements' })
  @UseGuards(new AuthGuard())
  async getUserAnnouncements(
    @Args('request') request: UserAnnouncementRequestParams,
  ): Promise<UserAnnouncementResponse[]> {
    return this.userAnnouncementService.findAll(request);
  }

  @Mutation(() => ResponseDTO)
  deleteUserAnnouncementsByUserId(@Args('user_id', { type: () => Int }) user_id: number): Promise<ResponseDTO> {
    return this.userAnnouncementService.deleteAll(user_id);
  }

  @Mutation(() => ResponseDTO)
  deleteUserAnnouncementById(@Args('id', { type: () => Int }) id: number): Promise<ResponseDTO> {
    return this.userAnnouncementService.deleteById(id);
  }

  @Mutation(() => UserAnnouncement)
  markRead(@Args('id', { type: () => Int }) id: number): Promise<UserAnnouncement> {
    return this.userAnnouncementService.markRead(id);
  }

  @Mutation(() => Announcement, { name: 'createAnnouncement' })
  @UseGuards(new AuthGuard())
  async createAnnouncement(
    @Args('createAnnouncementInput')
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.create(createAnnouncementInput);
  }

  @Mutation(() => Announcement, { name: 'updateAnnouncement' })
  @UseGuards(new AuthGuard())
  async updateAnnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    return this.announcementsService.update(updateAnnouncementInput);
  }
}
