import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In, createQueryBuilder } from 'typeorm';
import { Parent } from '../models/parent.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { TimezoneService } from './timezone.service';
import { StudentStatusService } from './student-status.service';
import { Person } from '../models/person.entity';
import { User } from '../models/user.entity';
import { Student } from '../models/student.entity';
import { UserRegion } from '../models/user-region.entity';
import { Region } from '../models/region.entity';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private timezoneService: TimezoneService,
    private studentStatusService: StudentStatusService,
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
        RegionId: region_id,
        date_begin: LessThanOrEqual(new Date()),
        date_end: MoreThanOrEqual(new Date()),
      },
      relations: ['SchoolPartners', 'ScheduleBuilder'],
    });
  }

  getAllActive(region_id: number): Promise<SchoolYear[]> {
    return this.schoolYearsRepository.find({
      where: {
        RegionId: region_id,
        date_end: MoreThanOrEqual(new Date()),
      },
    });
  }

  async getActiveHomeroomResourceSchoolYears(studentId: number): Promise<SchoolYear[]> {
    const activeSchoolYearIds = (await this.studentStatusService.findActive(studentId)).map(
      (item) => item.school_year_id,
    );

    const parent = await createQueryBuilder(Student)
      .innerJoinAndSelect(Parent, 'Parent', 'Parent.parent_id = `Student`.parent_id')
      .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
      .where({ student_id: studentId })
      .getRawOne();

    const regionId = (parent && parent.userRegion_region_id) || null;

    const now = await this.timezoneService.getTimezoneDate(regionId);
    return this.schoolYearsRepository.find({
      where: {
        school_year_id: In(activeSchoolYearIds),
        homeroom_resource_open: LessThanOrEqual(now),
        homeroom_resource_close: MoreThanOrEqual(now),
      },
    });
  }

  findNextYear(year: number, regionId: number): Promise<SchoolYear> {
    const today = new Date();
    return this.schoolYearsRepository
      .createQueryBuilder('year')
      .where('RegionId = :regionId', { regionId })
      .andWhere('date_begin BETWEEN :startDate AND :endDate', { startDate: year + '-01-01', endDate: year + '-12-31' })
      .getOne();
  }

  findPreviousYear(year: number, regionId: number): Promise<SchoolYear> {
    const today = new Date();
    return this.schoolYearsRepository
      .createQueryBuilder('year')
      .where('RegionId = :regionId', { regionId })
      .andWhere('date_begin BETWEEN :startDate AND :endDate', {
        startDate: year - 1 + '-01-01',
        endDate: year - 1 + '-12-31',
      })
      .getOne();
  }
}
