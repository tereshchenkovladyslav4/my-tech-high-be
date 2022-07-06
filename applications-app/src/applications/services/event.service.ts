import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationEvent } from '../models/event.entity';
import { CreateOrUpdateEventInput } from '../dto/create-or-update-event.inputs';
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
        .orderBy('eventType.priority', 'ASC')
        .where(`eventType.RegionId = ${region_id}`)
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async save(
    createEventInput: CreateOrUpdateEventInput,
  ): Promise<ApplicationEvent> {
    try {
      const result = await this.eventsRepository.save(createEventInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteById(event_id: number): Promise<boolean> {
    try {
      await this.eventsRepository.delete({ event_id: event_id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
