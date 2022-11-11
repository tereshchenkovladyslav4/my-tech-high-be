import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Period } from '../models/period.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ScheduleService } from './schedule.service';
import { SchedulePeriod } from '../models/schedule-period.entity';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly repo: Repository<Period>,
    private studentGradeLevelService: StudentGradeLevelsService,
    private scheduleService: ScheduleService,
  ) {}

  async find(studentId: number, schoolYearId: number, diplomaSeekingPath: string): Promise<Period[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }

    const schedule = await this.scheduleService.findOne(studentId, schoolYearId);

    const grade = studentGradeLevel.grade_level;
    const numericGrade = grade.startsWith('K') ? -1 : +grade;
    const diplomaQuery = (alias: string, diploma: string) => {
      if (diploma) return ` AND ${alias}.diploma_seeking_path in ('both', '${diploma}')`;
      else return '';
    };

    const titleCourseQuery = (alias: string, isAlt = false) => {
      const altString = isAlt ? 'alt_' : '';
      const excludeAlt = isAlt
        ? `AND (${alias}.min_grade > ${numericGrade} OR ${alias}.max_grade < ${numericGrade})`
        : '';
      return `${alias}.allow_request = ${true} AND ${alias}.is_active = ${true} ${excludeAlt} AND ${alias}.min_${altString}grade <= ${numericGrade} AND ${alias}.max_${altString}grade >= ${numericGrade}${diplomaQuery(
        alias,
        diplomaSeekingPath,
      )}`;
    };

    const courseRequestsQuery = (qb: SelectQueryBuilder<SchedulePeriod>) => {
      if (schedule) {
        qb.where(`ScheduleId <> ${schedule.schedule_id}`);
      }
      return qb;
    };

    const result = await this.repo
      .createQueryBuilder('period')
      .leftJoinAndSelect(
        'period.Subjects',
        'Subjects',
        `Subjects.allow_request = ${true} AND Subjects.is_active = ${true}`,
      )
      .leftJoinAndSelect('Subjects.Titles', 'Titles', `${titleCourseQuery('Titles')}`)
      .leftJoinAndSelect('Subjects.AltTitles', 'AltTitles', `${titleCourseQuery('AltTitles', true)}`)
      .leftJoinAndSelect('Titles.Courses', 'Courses', `${titleCourseQuery('Courses')}`)
      .leftJoinAndSelect('AltTitles.Courses', 'AltTitlesCourses', titleCourseQuery('AltTitlesCourses'))
      .leftJoinAndSelect('Titles.AltCourses', 'AltCourses', titleCourseQuery('AltCourses', true))
      .leftJoinAndSelect('AltTitles.AltCourses', 'AltTitlesAltCourses', titleCourseQuery('AltTitlesAltCourses', true))
      .leftJoinAndSelect('Subjects.Courses', 'SubjectsCourses', `${titleCourseQuery('SubjectsCourses')}`)
      .leftJoinAndSelect('Subjects.AltCourses', 'SubjectsAltCourses', `${titleCourseQuery('SubjectsAltCourses', true)}`)
      .loadRelationCountAndMap(
        'Courses.TotalRequests',
        'Courses.SchedulePeriods',
        'CoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'AltTitlesCourses.TotalRequests',
        'AltTitlesCourses.SchedulePeriods',
        'AltTitlesCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'AltCourses.TotalRequests',
        'AltCourses.SchedulePeriods',
        'AltCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'AltTitlesAltCourses.TotalRequests',
        'AltTitlesAltCourses.SchedulePeriods',
        'AltTitlesAltCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'SubjectsCourses.TotalRequests',
        'SubjectsCourses.SchedulePeriods',
        'SubjectsCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'SubjectsAltCourses.TotalRequests',
        'SubjectsAltCourses.SchedulePeriods',
        'SubjectsAltCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .where({ school_year_id: schoolYearId, archived: false })
      .getMany();

    result.map((period) => {
      period.Subjects.map((subject) => {
        (subject.Titles || subject.AltTitles).map((title) => {
          title.Courses = title.Courses.filter((course) => !course.limit || course.TotalRequests < course.limit);
          title.AltCourses = title.AltCourses.filter((course) => !course.limit || course.TotalRequests < course.limit);
        });
        subject.Courses = subject.Courses.filter((course) => !course.limit || course.TotalRequests < course.limit);
        subject.AltCourses = subject.AltCourses.filter(
          (course) => !course.limit || course.TotalRequests < course.limit,
        );
      });
    });

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
