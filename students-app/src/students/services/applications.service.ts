import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../models/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) {}

  async findByStudentAndAccepted(student_id: number, school_year_id: number): Promise<Application> {
    return this.applicationsRepository.findOne({
      where: {
        student_id: student_id,
        school_year_id: school_year_id,
        status: 'Accepted',
      },
    });
  }
}
