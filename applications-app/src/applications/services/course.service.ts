import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateCourseInput } from '../dto/create-or-update-course.inputs';
import { Course } from '../models/course.entity';
import { TitleService } from './title.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
    private titleService: TitleService,
  ) {}

  async find(providerId: number): Promise<Course[]> {
    return await this.repo.createQueryBuilder('course').where({ provider_id: providerId }).getMany();
  }

  async save(courseInput: CreateOrUpdateCourseInput): Promise<Course> {
    try {
      const result = await this.repo.save({ ...courseInput });

      if (courseInput.titles != undefined) {
        const titleIds = courseInput.titles.split(',');
        const titles = await this.titleService.findByIds(titleIds);
        await this.repo.save({ id: result.id, Titles: titles });
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(courseId: number): Promise<boolean> {
    try {
      await this.repo.save({ id: courseId, deleted: true });
      return true;
    } catch (error) {
      return false;
    }
  }

  async clone(courseId: number): Promise<boolean> {
    try {
      const course = await this.repo.findOne(courseId);
      delete course.id;
      await this.repo.save(course);
      return true;
    } catch (error) {
      return false;
    }
  }
}
