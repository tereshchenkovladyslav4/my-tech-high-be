import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Schedule } from '../models/schedule.entity';
import { ScheduleStatus } from '../enums';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
  ) {}

  async findOne(studentId: number, schoolYearId: number): Promise<Schedule> {
    return this.repo.findOne({ StudentId: studentId, SchoolYearId: schoolYearId });
  }

  async findAllSchedules(studentId: number): Promise<Schedule[]> {
    return this.repo.find({ StudentId: studentId });
  }
}
