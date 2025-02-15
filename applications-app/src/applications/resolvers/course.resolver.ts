import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Course } from '../models/course.entity';
import { CourseService } from '../services/course.service';
import { CreateOrUpdateCourseInput } from '../dto/create-or-update-course.inputs';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private service: CourseService) {}

  @Mutation(() => Course, { name: 'createOrUpdateCourse' })
  @UseGuards(new AuthGuard())
  async createOrUpdateCourse(
    @Args('createCourseInput')
    createCourseInput: CreateOrUpdateCourseInput,
  ): Promise<Course> {
    return this.service.save(createCourseInput);
  }

  @Mutation(() => Boolean, { name: 'deleteCourse' })
  @UseGuards(new AuthGuard())
  async deleteCourse(
    @Args('courseId')
    courseId: number,
  ): Promise<boolean> {
    return this.service.delete(courseId);
  }

  @Mutation(() => Boolean, { name: 'cloneCourse' })
  @UseGuards(new AuthGuard())
  async cloneCourse(
    @Args('courseId')
    courseId: number,
  ): Promise<boolean> {
    return this.service.clone(courseId);
  }
}
