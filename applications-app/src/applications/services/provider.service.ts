import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Provider } from '../models/provider.entity';
import { PeriodService } from './period.service';
import { CreateOrUpdateProviderInput } from '../dto/create-or-update-provider.inputs';
import { FindProvidersInput } from '../dto/find-providers.input';
import { CourseService } from './course.service';
import { CreateOrUpdateCourseInput } from '../dto/create-or-update-course.inputs';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly repo: Repository<Provider>,
    private periodService: PeriodService,
    private courseService: CourseService,
  ) {}

  async find(findProvidersInput: FindProvidersInput): Promise<Provider[]> {
    const { schoolYearId, searchField, isActive } = findProvidersInput;

    const qb = this.repo
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.Periods', 'Periods')
      .leftJoinAndSelect('provider.SchedulePeriods', 'SchedulePeriods')
      .leftJoinAndSelect(
        'provider.Courses',
        'Courses',
        `Courses.deleted = false AND Courses.name LIKE '%${searchField}%' AND Courses.is_active = ${!!isActive}`,
      )
      .leftJoinAndSelect('Courses.Titles', 'Titles')
      .where({ school_year_id: schoolYearId, deleted: false })
      .orderBy({ 'provider.priority': 'ASC', 'provider.name': 'ASC', 'Courses.name': 'ASC', 'Courses.id': 'ASC' });

    const subQuery = `EXISTS (
      SELECT * FROM mth_course course 
      WHERE course.provider_id = provider.id AND 
        course.deleted = false AND course.name LIKE '%${searchField}%' AND 
        course.is_active = ${!!isActive})
     `;

    if (searchField) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('provider.name like :search', { search: `%${searchField}%` }).orWhere(subQuery);
        }),
      );
    }

    if (isActive) {
      qb.andWhere({ is_active: !!isActive });
    } else {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where({ is_active: isActive }).orWhere(subQuery);
        }),
      );
    }
    return await qb.getMany();
  }

  async save(providerInput: CreateOrUpdateProviderInput): Promise<Provider> {
    try {
      const result = await this.repo.save({ ...providerInput });
      if (providerInput.periods != undefined) {
        const periodIds = providerInput.periods.split(',');
        const periods = await this.periodService.findByIds(periodIds);
        await this.repo.save({ id: result.id, Periods: periods });
      }

      // Please Note: If a Provider is archived, all courses under that provider should also be archived
      if (providerInput.id && providerInput.is_active !== undefined) {
        const courses = await this.courseService.find(providerInput.id);
        courses.map(async (course) => {
          await this.courseService.save({
            id: course.id,
            is_active: providerInput.is_active,
          } as CreateOrUpdateCourseInput);
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(providerId: number): Promise<boolean> {
    try {
      await this.repo.save({ id: providerId, deleted: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}
