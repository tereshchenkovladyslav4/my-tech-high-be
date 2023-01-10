import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../models/course.entity';
import { TitleService } from './title.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
    private titleService: TitleService,
  ) {}

  async cloneForProvider(
    cloneProviderId: number,
    newProviderId: number,
    titleIdMap: { [key: number]: number },
  ): Promise<{ [key: number]: number }> {
    const courses = await this.repo.find({ where: { provider_id: cloneProviderId }, relations: ['Titles'] });
    const idMap: { [key: number]: number } = {};
    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];
      const courseId = course.id;

      delete course.id;
      delete course.provider_id;

      const titleIds = course.Titles.map((x) => titleIdMap[x.title_id]);
      const titles = await this.titleService.findByIds(titleIds);

      const result = await this.repo.save({
        ...course,
        provider_id: newProviderId,
        Titles: titles,
      });
      idMap[courseId] = result.id;
    }
    return idMap;
  }
}
