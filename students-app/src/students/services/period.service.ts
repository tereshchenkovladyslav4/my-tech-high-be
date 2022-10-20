import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from '../models/period.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly repo: Repository<Period>,
    private studentGradeLevelService: StudentGradeLevelsService,
  ) {}

  async find(studentId: number, schoolYearId: number): Promise<Period[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }

    const grade = studentGradeLevel.grade_level;
    const courseQuery = (alias: string, isAlt = false) => {
      const altString = isAlt ? 'alt_' : '';
      return `${alias}.allow_request = ${true} AND ${alias}.is_active = ${true} AND ${alias}.min_${altString}grade <= ${grade} AND ${alias}.max_${altString}grade >= ${grade}`;
    };

    const result = await this.repo
      .createQueryBuilder('period')
      .leftJoinAndSelect(
        'period.Subjects',
        'Subjects',
        `Subjects.allow_request = ${true} AND Subjects.is_active = ${true}`,
      )
      .leftJoinAndSelect(
        'Subjects.Titles',
        'Titles',
        `Titles.allow_request = ${true} AND Titles.is_active = ${true} AND Titles.min_grade <= ${grade} AND Titles.max_grade >= ${grade}`,
      )
      .leftJoinAndSelect(
        'Subjects.AltTitles',
        'AltTitles',
        `AltTitles.allow_request = ${true} AND AltTitles.is_active = ${true} AND AltTitles.min_alt_grade <= ${grade} AND AltTitles.max_alt_grade >= ${grade}`,
      )
      .leftJoinAndSelect('Titles.Courses', 'Courses', courseQuery('Courses'))
      .leftJoinAndSelect('AltTitles.Courses', 'AltTitlesCourses', courseQuery('AltTitlesCourses'))
      .leftJoinAndSelect('Titles.AltCourses', 'AltCourses', courseQuery('AltCourses', true))
      .leftJoinAndSelect('AltTitles.AltCourses', 'AltTitlesAltCourses', courseQuery('AltTitlesAltCourses', true))
      .leftJoinAndSelect('Courses.Provider', 'CoursesProvider')
      .leftJoinAndSelect('AltTitlesCourses.Provider', 'AltTitlesCoursesProvider')
      .leftJoinAndSelect('AltCourses.Provider', 'AltCoursesProvider')
      .leftJoinAndSelect('AltTitlesAltCourses.Provider', 'AltTitlesAltCoursesProvider')
      .where({ school_year_id: schoolYearId, archived: false })
      .getMany();
    console.log(result);
    return result?.filter(
      (item) =>
        (grade?.includes('K') && item?.grade_level_min == 'Kindergarten') ||
        ((item?.grade_level_min == 'Kindergarten' || Number(item?.grade_level_min) <= Number(grade)) &&
          Number(item?.grade_level_max) >= Number(grade)),
    );
  }

  async findByIds(periodIds: (number | string)[]): Promise<Period[]> {
    return await this.repo.findByIds(periodIds);
  }
}
