import { Args, Query, Resolver, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EventsService } from '../services/event.service';
import { ApplicationEvent } from '../models/event.entity';
import { CreateOrUpdateEventInput } from '../dto/create-or-update-event.inputs';
import { FindEventsByRegionIdSearch } from '../dto/find-event-by-regionId-search';
@Resolver(() => ApplicationEvent)
export class EventsResolver {
  constructor(private eventsService: EventsService) {}

  @Query(() => [ApplicationEvent], { name: 'eventsByRegionId' })
  @UseGuards(new AuthGuard())
  async getEvents(
    @Args('findEventsByRegionIdSearch')
    findEventsByRegionIdSearch: FindEventsByRegionIdSearch,
  ): Promise<ApplicationEvent[]> {
    return this.eventsService.findAll(findEventsByRegionIdSearch);
  }

  @Mutation(() => ApplicationEvent, { name: 'createOrUpdateEvent' })
  @UseGuards(new AuthGuard())
  async createEvent(
    @Args('createEventInput')
    createEventInput: CreateOrUpdateEventInput,
  ): Promise<ApplicationEvent> {
    return this.eventsService.save(createEventInput);
  }

  @Mutation(() => Boolean, { name: 'removeEventById' })
  async removeWithdrawal(@Args('event_id', { type: () => Int }) event_id: number): Promise<boolean> {
    return await this.eventsService.deleteById(event_id);
  }
}
