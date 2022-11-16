import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Period } from '../models/period.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ScheduleService } from './schedule.service';
import { SchedulePeriod } from '../models/schedule-period.entity';
import { DiplomaSeekingPathStatus } from '../enums';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly repo: Repository<Period>,
    private studentGradeLevelService: StudentGradeLevelsService,
    private scheduleService: ScheduleService,
  ) {}

  private filterCourses(originalCourses, numericGrade) {
    const courses = [];
    const altCourses = [];
    originalCourses
      .filter((course) => !course.limit || course.TotalRequests < course.limit)
      .forEach((course) => {
        if (course.min_grade <= numericGrade && course.max_grade >= numericGrade) {
          courses.push(course);
        } else {
          altCourses.push(course);
        }
      });
    return { courses, altCourses };
  }

  private filterTitles(originalTitles, numericGrade) {
    const titles = [];
    const altTitles = [];
    originalTitles.forEach((title) => {
      if (title.min_grade <= numericGrade && title.max_grade >= numericGrade) {
        titles.push(title);
      } else {
        altTitles.push(title);
      }
    });
    return { titles, altTitles };
  }

  async find(studentId: number, schoolYearId: number, diplomaSeekingPath: string): Promise<Period[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }

    const schedule = await this.scheduleService.findOne(studentId, schoolYearId);

    const grade = studentGradeLevel.grade_level;
    const numericGrade = grade.startsWith('K') ? -1 : +grade;
    const diplomaQuery = (alias: string, diploma: string) => {
      switch (diploma) {
        case DiplomaSeekingPathStatus.BOTH:
          return ` AND ${alias}.diploma_seeking_path in ('${DiplomaSeekingPathStatus.BOTH}', '${DiplomaSeekingPathStatus.DIPLOMA_SEEKING}', '${DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING}')`;
        case DiplomaSeekingPathStatus.DIPLOMA_SEEKING:
          return ` AND ${alias}.diploma_seeking_path in ('${DiplomaSeekingPathStatus.BOTH}', '${DiplomaSeekingPathStatus.DIPLOMA_SEEKING}')`;
        case DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING:
          return ` AND ${alias}.diploma_seeking_path in ('${DiplomaSeekingPathStatus.BOTH}', '${DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING}')`;
        default:
          return '';
      }
    };

    const titleCourseQuery = (alias: string) => {
      const gradeQuery = `((${alias}.min_grade <= ${numericGrade} AND ${alias}.max_grade >= ${numericGrade}) OR (${alias}.min_alt_grade <= ${numericGrade} AND ${alias}.max_alt_grade >= ${numericGrade}))`;
      return `${alias}.allow_request = ${true} AND ${alias}.is_active = ${true} AND ${gradeQuery} ${diplomaQuery(
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
      .leftJoinAndSelect('Titles.Courses', 'Courses', `${titleCourseQuery('Courses')}`)
      .leftJoinAndSelect('Subjects.Courses', 'SubjectsCourses', `${titleCourseQuery('SubjectsCourses')}`)
      .loadRelationCountAndMap(
        'Courses.TotalRequests',
        'Courses.SchedulePeriods',
        'CoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .loadRelationCountAndMap(
        'SubjectsCourses.TotalRequests',
        'SubjectsCourses.SchedulePeriods',
        'SubjectsCoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .where({ school_year_id: schoolYearId, archived: false })
      .andWhere(`period.min_grade <= ${numericGrade} AND period.max_grade >= ${numericGrade}`)
      .getMany();

    result.map((period) => {
      period.Subjects.map((subject) => {
        subject.Titles.map((title) => {
          const filteredCourses = this.filterCourses(title.Courses, numericGrade);
          title.Courses = filteredCourses.courses;
          title.AltCourses = filteredCourses.altCourses;
        });
        const filteredCourses = this.filterCourses(subject.Courses, numericGrade);
        subject.Courses = filteredCourses.courses;
        subject.AltCourses = filteredCourses.altCourses;

        const filteredTitles = this.filterTitles(subject.Titles, numericGrade);
        subject.Titles = filteredTitles.titles;
        subject.AltTitles = filteredTitles.altTitles;
      });
    });

    return result;
  }

  async findByIds(periodIds: (number | string)[]): Promise<Period[]> {
    return await this.repo.findByIds(periodIds);
  }
}
