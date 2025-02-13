import { Args, Query, Resolver, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EventType } from '../models/event-type.entity';
import { EventTypesService } from '../services/event-types.service';
import { CreateEventTypeInput } from '../dto/new-event-type.inputs';
import { UpdateEventTypeInput, UpdateEventTypeInputs } from '../dto/update-event-type.inputs';
@Resolver(() => EventType)
export class EventTypesResolver {
  constructor(private eventTypesService: EventTypesService) {}

  @Query(() => [EventType], { name: 'eventTypes' })
  @UseGuards(new AuthGuard())
  async getEventTypes(@Args('region_id', { type: () => Int }) region_id: number): Promise<EventType[]> {
    return this.eventTypesService.findAll(region_id);
  }

  @Mutation(() => EventType, { name: 'createEventType' })
  @UseGuards(new AuthGuard())
  async createEventType(
    @Args('createEventTypeInput')
    createEventTypeInput: CreateEventTypeInput,
  ): Promise<EventType> {
    return this.eventTypesService.create(createEventTypeInput);
  }

  @Mutation(() => EventType, { name: 'updateEventType' })
  @UseGuards(new AuthGuard())
  async updateEventType(
    @Args('updateEventTypeInput')
    updateEventTypeInput: UpdateEventTypeInput,
  ): Promise<EventType> {
    return this.eventTypesService.update(updateEventTypeInput);
  }

  @Mutation(() => [EventType], { name: 'updateEventTypes' })
  @UseGuards(new AuthGuard())
  async updateEventTypes(
    @Args('updateEventTypeInputs')
    updateEventTypeInputs: UpdateEventTypeInputs,
  ): Promise<EventType[]> {
    return this.eventTypesService.updates(updateEventTypeInputs);
  }
}
