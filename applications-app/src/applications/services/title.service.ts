import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../models/title.entity';
import { CreateOrUpdateTitleInput } from '../dto/create-or-update-title.inputs';
import { Subject } from '../models/subject.entity';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(Title)
    private readonly repo: Repository<Title>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async find(subjectId: number): Promise<Title[]> {
    return await this.repo
      .createQueryBuilder('title')
      .where({ subject_id: subjectId })
      .orderBy({ priority: 'ASC', title_id: 'ASC' })
      .getMany();
  }

  async findActive(subjectId: number): Promise<Title[]> {
    return await this.repo
      .createQueryBuilder('title')
      .where({ subject_id: subjectId, is_active: true })
      .orderBy({ priority: 'ASC', title_id: 'ASC' })
      .getMany();
  }

  async findByIds(titleIds: (number | string)[]): Promise<Title[]> {
    return await this.repo.findByIds(titleIds);
  }

  async save(titleInput: CreateOrUpdateTitleInput): Promise<Title> {
    try {
      if (!titleInput.title_id) {
        const totalCnt = await this.repo.count({
          subject_id: titleInput.subject_id,
        });
        if (!titleInput.priority) titleInput.priority = totalCnt + 1;
      }

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
      await this.reorder(title.subject_id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async reorder(subjectId: number): Promise<boolean> {
    try {
      const titles = await this.find(subjectId);
      titles.map(async (item, index) => {
        await this.save({ ...item, priority: index + 1 } as CreateOrUpdateTitleInput);
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
