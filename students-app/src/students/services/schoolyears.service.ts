import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Parent } from '../models/parent.entity';
import { SchoolYear } from '../models/schoolyear.entity';
@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne(school_year_id);
  }

  findAll(): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find();
  }
  getCurrent(region_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        date_begin: LessThanOrEqual(new Date()),
        date_end: MoreThanOrEqual(new Date()),
        RegionId: region_id,
      },
    });
  }
}
