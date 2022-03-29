import { Parent, ResolveField, Resolver, Query, Context } from '@nestjs/graphql';
import { User } from '../models/user.entity';
import { StudentsService } from '../services/students.service';
import { Student } from '../models/student.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Query((returns) => User)
  @UseGuards(new AuthGuard())
  me_students(@Context('user') user: User) {
    return user;
  }

  @ResolveField((of) => [Student], { name: 'students' })
  public async getStudents(@Parent() user: User): Promise<Student[]> {
    return this.studentsService.forUsers(user.user_id);
  }
}
