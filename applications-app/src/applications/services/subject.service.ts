import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Subject } from '../models/subject.entity';
import { CreateOrUpdateSubjectInput } from '../dto/create-or-update-subject.inputs';
import { PeriodService } from './period.service';
import { TitleService } from './title.service';
import { CreateOrUpdateTitleInput } from '../dto/create-or-update-title.inputs';
import { FindSubjectsInput } from '../dto/find-subjects.input';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private readonly repo: Repository<Subject>,
    private periodService: PeriodService,
    private titleService: TitleService,
  ) {}

  async find(findSubjectsInput: FindSubjectsInput): Promise<Subject[]> {
    const { schoolYearId, searchField, isActive } = findSubjectsInput;

    const qb = this.repo
      .createQueryBuilder('subject')
      .leftJoinAndSelect('subject.Periods', 'Periods')
      .leftJoinAndSelect(
        'subject.Titles',
        'Titles',
        `Titles.deleted = false ${
          searchField ? 'AND Titles.name LIKE "%' + searchField + '%"' : ''
        } AND Titles.is_active = ${!!isActive}`,
      )
      .where({ SchoolYearId: schoolYearId, deleted: false })
      .orderBy({
        'subject.is_active': 'DESC',
        'subject.priority': 'ASC',
        'subject.subject_id': 'ASC',
        'Titles.title_id': 'ASC',
      });

    const subQuery = `EXISTS (
      SELECT * FROM mth_title title 
      WHERE title.subject_id = subject.subject_id AND 
        title.deleted = false AND title.name LIKE '%${searchField}%' AND 
        title.is_active = ${!!isActive})
     `;
    if (searchField) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('subject.name like :search', { search: `%${searchField}%` }).orWhere(subQuery);
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

  async save(subjectInput: CreateOrUpdateSubjectInput): Promise<Subject> {
    try {
      if (!subjectInput.subject_id) {
        const totalCnt = await this.repo.count({
          SchoolYearId: subjectInput.SchoolYearId,
        });
        if (!subjectInput.priority) subjectInput.priority = totalCnt + 1;
      }

      const result = await this.repo.save({ ...subjectInput });

      if (subjectInput.periods != undefined) {
        const periodIds = subjectInput.periods.split(',');
        const periods = await this.periodService.findByIds(periodIds);
        await this.repo.save({ subject_id: result.subject_id, Periods: periods });
      }

      // Please Note: If a Subject is archived, all titles under that subject should also be archived
      if (subjectInput.subject_id && subjectInput.is_active !== undefined) {
        const titles = await this.titleService.find(subjectInput.subject_id);
        titles.map(async (title) => {
          await this.titleService.save({ ...title, is_active: subjectInput.is_active } as CreateOrUpdateTitleInput);
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(subjectId: number): Promise<boolean> {
    try {
      await this.repo.save({ subject_id: subjectId, deleted: true });
      return true;
    } catch (error) {
      return false;
    }
  }
}
