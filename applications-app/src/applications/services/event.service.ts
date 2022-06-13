import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEvent } from '../models/event.entity';
import { CreateEventInput } from '../dto/new-event.inputs';
import { UpdateEventInput } from '../dto/update-event.inputs';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(ApplicationEvent)
    private readonly eventsRepository: Repository<ApplicationEvent>,
  ) {}

  async findAll(region_id: number): Promise<Array<ApplicationEvent>> {
    try {
      const results = await this.eventsRepository
        .createQueryBuilder('mth_event')
        .leftJoinAndSelect('mth_event.EventType', 'eventType')
        .where(`eventType.RegionId = ${region_id}`)
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async create(createEventInput: CreateEventInput): Promise<ApplicationEvent> {
    try {
      const result = await this.eventsRepository.save(createEventInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async update(updateEventInput: UpdateEventInput): Promise<ApplicationEvent> {
    try {
      return await this.eventsRepository.save(updateEventInput);
    } catch (error) {
      return error;
    }
  }
}
