import { Injectable, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from 'src/models/period.entity';
import { Repository, createQueryBuilder, Brackets, DeleteResult, Not } from 'typeorm';
import { PeriodInput } from '../dto/period.inputs';
import { SchoolYearsService } from './schoolyear.service';
import { ScheduleBuilderService } from './schedule-builder.service';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
    private schoolYearsService: SchoolYearsService,
    private scheduleBuilderService: ScheduleBuilderService,
  ) {}

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
    return await qb.getMany();
  }
  // find all saved period indexes for validation
  async findPeriodByIds(school_year_id: number): Promise<Period[]> {
    const items = await createQueryBuilder(Period)
      .where('school_year_id = :school_year_id', { school_year_id })
      .getMany();

    return items;
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
    // validation - max_num_periods from from scheduleBuilderService
    // -------------------------------------
    const setting = await this.scheduleBuilderService.findOneById(args.school_year_id);
    if (!setting) {
      throw new UnprocessableEntityException('There is no setting for max_num_periods from scheduleBuilderService');
    }
    if (setting.max_num_periods < args.period) {
      throw new UnprocessableEntityException('Period must be less than max period number from scheduleBuilderService');
    }
    // -------------------------------------
    // validation - unique period per school_year_id
    // -------------------------------------
    let periodExist;
    if (!args.id) {
      periodExist = await this.periodRepository.findOne({
        school_year_id: args.school_year_id,
        period: args.period,
      });
    } else {
      periodExist = await this.periodRepository.findOne({
        school_year_id: args.school_year_id,
        period: args.period,
        id: Not(args.id),
      });
    }
    if (periodExist) throw new UnprocessableEntityException('A record with same period and school year already exist');

    // -------------------------------------
    // validation - max/min grade levels
    // -------------------------------------
    const schoolyear = await this.schoolYearsService.findOneById(args.school_year_id);
    const grades =
      (schoolyear.grades.split(',') || [])
        .sort((a: string, b: string) => (parseInt(a) > parseInt(b) ? 1 : -1))
        .sort((a: string) => (a === 'Kindergarten' ? -1 : 0)) || [];

    // validation - grade_level_min
    const indexMin = grades.findIndex((el) => el === args.grade_level_min);
    if (indexMin === -1) throw new UnprocessableEntityException('Minimum Grade level does not exist');

    // validation - grade_level_max
    const indexMax = grades.findIndex((el) => el === args.grade_level_max);
    if (indexMax === -1) throw new UnprocessableEntityException('Maximum Grade level does not exist');

    // validation - min < max
    if (indexMin >= indexMax) {
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
}
