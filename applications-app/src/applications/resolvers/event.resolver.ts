import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EventsService } from '../services/event.service';
import { ApplicationEvent } from '../models/event.entity';
import { CreateEventInput } from '../dto/new-event.inputs';
import { UpdateEventInput } from '../dto/update-event.inputs';
@Resolver((of) => ApplicationEvent)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query((returns) => [ApplicationEvent], { name: 'eventsByRegionId' })
  @UseGuards(new AuthGuard())
  async getEvents(
    @Args('region_id') region_id: number,
  ): Promise<ApplicationEvent[]> {
    return this.eventsService.findAll(region_id);
  }

  @Mutation((returns) => ApplicationEvent, { name: 'createEvent' })
  @UseGuards(new AuthGuard())
  async createEvent(
    @Args('createEventInput')
    createEventInput: CreateEventInput,
  ): Promise<ApplicationEvent> {
    return this.eventsService.create(createEventInput);
  }

  @Mutation((returns) => ApplicationEvent, { name: 'updateEvent' })
  @UseGuards(new AuthGuard())
  async updateEventType(
    @Args('updateEventInput')
    updateEventInput: UpdateEventInput,
  ): Promise<ApplicationEvent> {
    return this.eventsService.update(updateEventInput);
  }
}
