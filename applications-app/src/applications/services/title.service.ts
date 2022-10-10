import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../models/title.entity';
import { CreateOrUpdateTitleInput } from '../dto/create-or-update-title.inputs';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(Title)
    private readonly repo: Repository<Title>,
  ) {}

  async find(subjectId: number): Promise<Title[]> {
    return await this.repo.createQueryBuilder('title').where({ subject_id: subjectId }).getMany();
  }

  async findByIds(titleIds: (number | string)[]): Promise<Title[]> {
    return await this.repo.findByIds(titleIds);
  }

  async save(titleInput: CreateOrUpdateTitleInput): Promise<Title> {
    try {
      const result = await this.repo.save({ ...titleInput });
      return result;
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
}
