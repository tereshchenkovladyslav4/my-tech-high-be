import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EventType } from '../models/event-type.entity';
import { EventTypesService } from '../services/event-types.service';
import { CreateEventTypeInput } from '../dto/new-event-type.inputs';
import {
  UpdateEventTypeInput,
  UpdateEventTypeInputs,
} from '../dto/update-event-type.inputs';
@Resolver((of) => EventType)
export class EventTypesResolver {
  constructor(private eventTypesService: EventTypesService) {}

  @Query((returns) => [EventType], { name: 'eventTypes' })
  @UseGuards(new AuthGuard())
  async getEventTypes(
    @Args('region_id') region_id: number,
  ): Promise<EventType[]> {
    return this.eventTypesService.findAll(region_id);
  }

  @Mutation((returns) => EventType, { name: 'createEventType' })
  @UseGuards(new AuthGuard())
  async createEventType(
    @Args('createEventTypeInput')
    createEventTypeInput: CreateEventTypeInput,
  ): Promise<EventType> {
    return this.eventTypesService.create(createEventTypeInput);
  }

  @Mutation((returns) => EventType, { name: 'updateEventType' })
  @UseGuards(new AuthGuard())
  async updateEventType(
    @Args('updateEventTypeInput')
    updateEventTypeInput: UpdateEventTypeInput,
  ): Promise<EventType> {
    return this.eventTypesService.update(updateEventTypeInput);
  }

  @Mutation((returns) => [EventType], { name: 'updateEventTypes' })
  @UseGuards(new AuthGuard())
  async updateEventTypes(
    @Args('updateEventTypeInputs')
    updateEventTypeInputs: UpdateEventTypeInputs,
  ): Promise<EventType[]> {
    return this.eventTypesService.updates(updateEventTypeInputs);
  }
}
