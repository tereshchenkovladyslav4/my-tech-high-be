import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventType } from '../models/event-type.entity';
import { CreateEventTypeInput } from '../dto/new-event-type.inputs';
import {
  UpdateEventTypeInput,
  UpdateEventTypeInputs,
} from '../dto/update-event-type.inputs';
@Injectable()
export class EventTypesService {
  constructor(
    @InjectRepository(EventType)
    private readonly eventTypesRepository: Repository<EventType>,
  ) {}

  async findAll(region_id: number): Promise<Array<EventType>> {
    try {
      const results = await this.eventTypesRepository
        .createQueryBuilder('mth_event_type')
        .where({ RegionId: region_id })
        .orderBy('mth_event_type.priority', 'ASC')
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async create(eventType: CreateEventTypeInput): Promise<EventType> {
    try {
      const result = await this.eventTypesRepository.save(eventType);
      return result;
    } catch (error) {
      return error;
    }
  }

  async update(updateEventTypeInput: UpdateEventTypeInput): Promise<EventType> {
    try {
      return await this.eventTypesRepository.save(updateEventTypeInput);
    } catch (error) {
      return error;
    }
  }

  async updates(
    updateEventTypeInputs: UpdateEventTypeInputs,
  ): Promise<EventType[]> {
    try {
      const { updateEventTypes } = updateEventTypeInputs;
      return await this.eventTypesRepository.save(updateEventTypes);
    } catch (error) {
      return error;
    }
  }
}
