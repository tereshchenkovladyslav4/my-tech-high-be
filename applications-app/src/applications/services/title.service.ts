import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../models/title.entity';
import { CreateOrUpdateTitleInput } from '../dto/create-or-update-title.inputs';
import { Subject } from '../models/subject.entity';
import { StateCodes } from '../models/state-codes.entity';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(Title)
    private readonly repo: Repository<Title>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(StateCodes)
    private readonly stateCodesRepo: Repository<StateCodes>,
  ) {}

  async find(subjectId: number): Promise<Title[]> {
    return await this.repo
      .createQueryBuilder('title')
      .where({ subject_id: subjectId })
      .orderBy({ name: 'ASC', title_id: 'ASC' })
      .getMany();
  }

  async findActive(subjectId: number): Promise<Title[]> {
    return await this.repo
      .createQueryBuilder('title')
      .where({ subject_id: subjectId, is_active: true })
      .orderBy({ name: 'ASC', title_id: 'ASC' })
      .getMany();
  }

  async findByIds(titleIds: (number | string)[]): Promise<Title[]> {
    return await this.repo.findByIds(titleIds);
  }

  async save(titleInput: CreateOrUpdateTitleInput): Promise<Title> {
    try {
      // Please Note: If a title is unarchived, the subject with this title should also be unarchived if it is archived
      if (titleInput.title_id && titleInput.is_active === true) {
        const title = await this.repo.findOne(titleInput.title_id);
        await this.subjectRepo.save({ subject_id: title.subject_id, is_active: true });
      }

      return await this.repo.save({ ...titleInput });
    } catch (error) {
      return error;
    }
  }

  async delete(titleId: number): Promise<boolean> {
    try {
      await this.repo.save({ title_id: titleId, deleted: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clone(titleId: number): Promise<boolean> {
    try {
      const title = await this.repo.findOne(titleId);
      delete title.title_id;
      await this.repo.save(title);
      return true;
    } catch (error) {
      return false;
    }
  }

  async createStateCodesBySchoolYearId(schoolYearId: number): Promise<boolean> {
    try {
      const titles = await this.repo
        .createQueryBuilder('title')
        .leftJoinAndSelect('title.Subject', 'subject')
        .andWhere(`subject.SchoolYearId = ${schoolYearId}`)
        .andWhere('subject.is_active = true')
        .orderBy({ title_id: 'ASC' })
        .getMany();

      titles.map(async (obj) => {
        const newStateCodes = [];
        const grades: number[] = [obj.min_grade, obj.min_alt_grade, obj.max_grade, obj.max_alt_grade].filter(
          (item) => !!item,
        ) as number[];
        const minGrade = Math.min(...grades, Number.POSITIVE_INFINITY);
        const maxGrade = Math.max(...grades, Number.NEGATIVE_INFINITY);
        if (minGrade !== maxGrade) {
          for (let i = minGrade === -1 ? 0 : minGrade; i <= (maxGrade === -1 ? 0 : maxGrade); i++) {
            newStateCodes.push({
              TitleId: obj.title_id,
              title_name: obj.name,
              SchoolYearId: obj.Subject.SchoolYearId,
              subject: obj.Subject.name,
              grade: i === 0 ? 'K' : i.toString(),
              stateCode: '',
              teacher: '',
            });
          }
          await this.stateCodesRepo.save(newStateCodes);
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
