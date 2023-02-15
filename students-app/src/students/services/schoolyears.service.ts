import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In, createQueryBuilder, Not } from 'typeorm';
import { Parent } from '../models/parent.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { TimezoneService } from './timezone.service';
import { StudentStatusService } from './student-status.service';
import { Person } from '../models/person.entity';
import { User } from '../models/user.entity';
import { Student } from '../models/student.entity';
import { UserRegion } from '../models/user-region.entity';
import { ScheduleService } from './schedule.service';
import { StudentLearningLogService } from './student-learning-log.service';

@Injectable()
export class SchoolYearsService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private timezoneService: TimezoneService,
    private studentStatusService: StudentStatusService,
    private scheduleService: ScheduleService,
    private studentLearningLogService: StudentLearningLogService,
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

  private async getRegionId(studentId: number): Promise<number> {
    const parent = await createQueryBuilder(Student)
      .innerJoinAndSelect(Parent, 'Parent', 'Parent.parent_id = `Student`.parent_id')
      .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
      .where({ student_id: studentId })
      .getRawOne();

    const regionId = (parent && parent.userRegion_region_id) || null;
    return regionId;
  }

  async getActiveHomeroomResourceSchoolYears(studentId: number): Promise<SchoolYear[]> {
    const activeSchoolYearIds = (await this.studentStatusService.findResourceActive(studentId)).map(
      (item) => item.school_year_id,
    );

    const regionId = await this.getRegionId(studentId);

    const now = await this.timezoneService.getTimezoneDate(regionId);
    return this.schoolYearsRepository.find({
      where: {
        school_year_id: In(activeSchoolYearIds),
        homeroom_resource_open: LessThanOrEqual(now),
        homeroom_resource_close: MoreThanOrEqual(now),
      },
    });
  }

  async getActiveScheduleSchoolYears(studentId: number): Promise<SchoolYear[]> {
    // TODO Have to remove gradated schedules
    const schedules = await this.scheduleService.findAllSchedules(studentId);
    const activeScheduleSchoolYearIds = schedules.map((item) => item.SchoolYearId);

    const activeScheduleSchoolYears = await this.schoolYearsRepository.find({
      where: {
        school_year_id: In(activeScheduleSchoolYearIds),
      },
      relations: ['ScheduleBuilder'],
    });
    activeScheduleSchoolYears.map((item) => {
      item.ScheduleStatus = schedules.find(
        (schedule) => schedule.SchoolYearId === item.school_year_id && !schedule.is_second_semester,
      )?.status;
    });

    const regionId = await this.getRegionId(studentId);

    const now = await this.timezoneService.getTimezoneDate(regionId);
    const openScheduleSchoolYears = await this.schoolYearsRepository.find({
      where: {
        RegionId: regionId,
        school_year_id: Not(In(activeScheduleSchoolYearIds)),
        schedule_builder_open: LessThanOrEqual(now),
        schedule_builder_close: MoreThanOrEqual(now),
      },
      relations: ['ScheduleBuilder'],
    });

    const result = activeScheduleSchoolYears.concat(openScheduleSchoolYears);
    result.map((item) => {
      item.IsCurrentYear = item.date_begin <= now && item.date_end >= now;
      item.IsScheduleBuilderOpen = item.schedule_builder_open <= now && item.schedule_builder_close >= now;
      item.IsSecondSemesterOpen = item.second_semester_open <= now && item.second_semester_close >= now;
    });
    return result;
  }

  async getActiveHomeroomSchoolYears(studentId: number): Promise<SchoolYear[]> {
    const learningLogs = await this.studentLearningLogService.findAllByStudentId(studentId);
    const activeHomeroomSchoolYearIds = learningLogs.map((item) => item.SchoolYearId);

    const activeHomeroomSchoolYears = await this.schoolYearsRepository.find({
      where: {
        school_year_id: In(activeHomeroomSchoolYearIds),
      },
      relations: ['HomeroomSettings'],
    });

    const regionId = await this.getRegionId(studentId);

    const now = await this.timezoneService.getTimezoneDate(regionId);
    const openHomeroomSchoolYears = await this.schoolYearsRepository.find({
      where: {
        RegionId: regionId,
        school_year_id: Not(In(activeHomeroomSchoolYearIds)),
        date_begin: LessThanOrEqual(now),
        date_end: MoreThanOrEqual(now),
      },
      relations: ['HomeroomSettings'],
    });

    const result = activeHomeroomSchoolYears.concat(openHomeroomSchoolYears);
    result.map((item) => {
      item.IsCurrentYear = item.date_begin <= now && item.date_end >= now;
    });
    return result;
  }

  async getReimbursementRequestSchoolYears(regionId: number): Promise<SchoolYear[]> {
    const now = await this.timezoneService.getTimezoneDate(regionId);

    const pastSchoolYears = await this.schoolYearsRepository.find({
      where: {
        RegionId: regionId,
        date_begin: LessThanOrEqual(now),
      },
    });

    return pastSchoolYears;
  }

  findNextYear(year: number, regionId: number): Promise<SchoolYear> {
    return this.schoolYearsRepository
      .createQueryBuilder('year')
      .where('RegionId = :regionId', { regionId })
      .andWhere('date_begin BETWEEN :startDate AND :endDate', { startDate: year + '-01-01', endDate: year + '-12-31' })
      .getOne();
  }

  findPreviousYear(year: number, regionId: number): Promise<SchoolYear> {
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
