import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SchoolYear } from '../models/schoolyear.entity';
import { CreateSchoolYearInput } from '../dto/create-schoolyear.inputs';

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
  ) {}

  findOneById(school_year_id: number): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: { school_year_id: school_year_id },
      relations: ['region'],
    });
  }

  getCurrent(): Promise<SchoolYear> {
    return this.schoolYearsRepository.findOne({
      where: {
        date_begin: LessThanOrEqual(new Date()),
        date_end: MoreThanOrEqual(new Date()),
      },
    });
  }

  findAll(): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find();
  }

  findThisYear(): Promise<SchoolYear> {
    const today = new Date();
    return this.schoolYearsRepository
      .createQueryBuilder('year')
      .where('date_begin BETWEEN :startDate AND :endDate', {
        startDate: today.getFullYear() + '-01-01',
        endDate: today.getFullYear() + '-12-31',
      })
      .getOne();
  }
  findNextYear(): Promise<SchoolYear> {
    const today = new Date();
    return this.schoolYearsRepository
      .createQueryBuilder('year')
      .where('date_begin BETWEEN :startDate AND :endDate', {
        startDate: today.getFullYear() + 1 + '-01-01',
        endDate: today.getFullYear() + 1 + '-12-31',
      })
      .getOne();
  }
  getAllActive(region_id: number): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find({
      where: {
        RegionId: region_id,
        date_end: MoreThanOrEqual(new Date()),
      },
    });
  }
  async create(createSchoolYearInput: CreateSchoolYearInput): Promise<SchoolYear> {
    return this.schoolYearsRepository.save(createSchoolYearInput);
  }
}
