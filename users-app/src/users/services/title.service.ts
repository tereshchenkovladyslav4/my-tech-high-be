import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Title } from '../../models/title.entity';

@Injectable()
export class TitleService {
  constructor(
    @InjectRepository(Title)
    private readonly repo: Repository<Title>,
  ) {}

  async findByIds(titleIds: (number | string)[]): Promise<Title[]> {
    return await this.repo.findByIds(titleIds);
  }

  async cloneForSubject(cloneSubjectId: number, newSubjectId: number): Promise<{ [key: number]: number }> {
    const titles = await this.repo.find({ where: { subject_id: cloneSubjectId } });
    const idMap: { [key: number]: number } = {};
    for (let index = 0; index < titles.length; index++) {
      const title = titles[index];
      const titleId = title.title_id;

      delete title.title_id;
      delete title.subject_id;

      const result = await this.repo.save({
        ...title,
        subject_id: newSubjectId,
      });
      idMap[titleId] = result.title_id;
    }
    return idMap;
  }
}
