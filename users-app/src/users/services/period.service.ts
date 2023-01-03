import { Injectable, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from 'src/models/period.entity';
import { Repository, createQueryBuilder, Brackets, DeleteResult } from 'typeorm';
import { PeriodInput } from '../dto/period.inputs';
import { ScheduleBuilderService } from './schedule-builder.service';
import { SchoolYear } from '../../models/schoolyear.entity';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
    @InjectRepository(SchoolYear)
    private schoolYearsRepository: Repository<SchoolYear>,
    private scheduleBuilderService: ScheduleBuilderService,
  ) {}

  async findByIds(periodIds: (number | string)[]): Promise<Period[]> {
    return await this.periodRepository.findByIds(periodIds);
  }

  // ===========================================================================================================
  // find all
  async find(school_year_id: number, archived?: boolean, keyword?: string): Promise<Period[]> {
    const qb = createQueryBuilder(Period).where('school_year_id = :school_year_id', { school_year_id });
    // archived
    if (archived === true) qb.andWhere('`archived` = 1');
    else if (archived === false) qb.andWhere('`archived` = 0');
    // keyword
    if (keyword) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere(`category like '%${keyword}%'`)
            .orWhere(`message_semester like '%${keyword}%'`)
            .orWhere(`message_period like '%${keyword}%'`);
        }),
      );
    }
    qb.orderBy({ period: 'ASC', id: 'ASC' });
    return await qb.getMany();
  }

  // ===========================================================================================================
  // find all saved period indexes for validation
  async findIds(school_year_id: number): Promise<number[]> {
    const items = await createQueryBuilder(Period)
      .where('school_year_id = :school_year_id', { school_year_id })
      .getMany();

    return items.map((el) => el.period);
  }

  // ===========================================================================================================
  // upsert
  async upsert(args: PeriodInput): Promise<Period> {
    // -------------------------------------
    // validation - max_num_periods from scheduleBuilderService
    // -------------------------------------
    const setting = await this.scheduleBuilderService.findOneById(args.school_year_id);
    if (!setting) {
      throw new UnprocessableEntityException('There is no setting for max_num_periods from scheduleBuilderService');
    }
    if (setting.max_num_periods < args.period) {
      throw new UnprocessableEntityException('Period must be less than max period number from scheduleBuilderService');
    }

    // -------------------------------------
    // validation - max/min grade levels
    // -------------------------------------
    const schoolYear = await this.schoolYearsRepository.findOne({
      where: {
        school_year_id: args.school_year_id,
      },
    });
    const grades =
      (schoolYear.grades.split(',') || [])
        .map((item) => (item === 'Kindergarten' ? -1 : parseInt(item)))
        .sort((a, b) => (a > b ? 1 : -1)) || [];

    // validation - min_grade
    const indexMin = grades.findIndex((el) => el === args.min_grade);
    if (indexMin === -1) throw new UnprocessableEntityException('Minimum Grade level does not exist');

    // validation - max_grade
    const indexMax = grades.findIndex((el) => el === args.max_grade);
    if (indexMax === -1) throw new UnprocessableEntityException('Maximum Grade level does not exist');

    // validation - min < max
    if (indexMin > indexMax) {
      throw new UnprocessableEntityException('Maximum Grade level must be greater than Minimum Grade level');
    }
    // -----------------
    // success
    // -----------------
    const da = await this.periodRepository.save(args);
    return await this.periodRepository.findOne(da.id);
  }

  // ===========================================================================================================
  // setArchived
  async setArchived(id: number, archived: boolean): Promise<Period> {
    try {
      return await this.periodRepository.save({ id, archived });
    } catch (error) {
      throw new ServiceUnavailableException('Error');
    }
  }

  // ===========================================================================================================
  // deleteByIds
  async deleteByIds(ids: number[]): Promise<DeleteResult> {
    try {
      return await createQueryBuilder(Period).delete().where('`archived` = 1 AND `id` IN (:...ids)', { ids }).execute();
    } catch (error) {
      throw new ServiceUnavailableException('Error');
    }
  }

  async cloneForSchoolYear(cloneSchoolYearId: number, newSchoolYearId: number): Promise<{ [key: number]: number }> {
    const periods = await this.periodRepository.find({ where: { school_year_id: cloneSchoolYearId } });
    const idMap: { [key: number]: number } = {};
    for (let index = 0; index < periods.length; index++) {
      const period = periods[index];
      const periodId = period.id;

      delete period.id;
      delete period.school_year_id;
      delete period.created_at;

      const result = await this.periodRepository.save({
        ...period,
        school_year_id: newSchoolYearId,
      });
      idMap[periodId] = result.id;
    }
    return idMap;
  }
}
