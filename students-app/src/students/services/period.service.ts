import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Period } from '../models/period.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { ScheduleService } from './schedule.service';
import { SchedulePeriod } from '../models/schedule-period.entity';
import { DiplomaSeekingPathStatus } from '../enums';
import { DiplomaAnswerService } from './diploma-answer.service';
import { convertDiplomaSeeking } from '../utils';

@Injectable()
export class PeriodService {
  constructor(
    @InjectRepository(Period)
    private readonly repo: Repository<Period>,
    private studentGradeLevelService: StudentGradeLevelsService,
    private scheduleService: ScheduleService,
    private diplomaAnswerService: DiplomaAnswerService,
  ) {}

  private filterCourses(originalCourses, numericGrade, isGradeFilter) {
    const courses = [];
    const altCourses = [];
    originalCourses
      .filter((course) => !course.limit || course.TotalRequests < course.limit)
      .forEach((course) => {
        if (isGradeFilter) {
          if (course.min_grade <= numericGrade && course.max_grade >= numericGrade) {
            courses.push(course);
          } else {
            altCourses.push(course);
          }
        } else {
          courses.push(course);
          altCourses.push(course);
        }
      });
    return { courses, altCourses };
  }

  private filterTitles(originalTitles, numericGrade, isGradeFilter) {
    const titles = [];
    const altTitles = [];
    originalTitles.forEach((title) => {
      if (isGradeFilter) {
        if (title.min_grade <= numericGrade && title.max_grade >= numericGrade) {
          titles.push(title);
        } else {
          altTitles.push(title);
        }
      } else {
        titles.push(title);
        altTitles.push(title);
      }
    });
    return { titles, altTitles };
  }

  async find(studentId: number, schoolYearId: number, isGradeFilter: boolean): Promise<Period[]> {
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentId);

    if (!studentGradeLevel) {
      return [];
    }
    const diplomaAnswer = await this.diplomaAnswerService.getDiplomaAnswer(studentId, schoolYearId);

    const schedule = await this.scheduleService.findOne(studentId, schoolYearId);
    const grade = studentGradeLevel.grade_level;
    const numericGrade = grade.startsWith('K') ? -1 : +grade;
    const diplomaQuery = (alias: string) => {
      switch (convertDiplomaSeeking(diplomaAnswer?.answer)) {
        case DiplomaSeekingPathStatus.DIPLOMA_SEEKING:
          return `${alias}.diploma_seeking_path in ('${DiplomaSeekingPathStatus.BOTH}', '${DiplomaSeekingPathStatus.DIPLOMA_SEEKING}')`;
        case DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING:
          return `${alias}.diploma_seeking_path in ('${DiplomaSeekingPathStatus.BOTH}', '${DiplomaSeekingPathStatus.NON_DIPLOMA_SEEKING}')`;
        default:
          return '';
      }
    };

    const titleCourseQuery = (alias: string) => {
      const gradeQuery = `AND ((${alias}.min_grade <= ${numericGrade} AND ${alias}.max_grade >= ${numericGrade}) OR (${alias}.min_alt_grade <= ${numericGrade} AND ${alias}.max_alt_grade >= ${numericGrade}))`;
      return `${alias}.allow_request = ${true} AND ${alias}.is_active = ${true} ${isGradeFilter ? gradeQuery : ''} ${
        diplomaQuery(alias) ? ' AND ' + diplomaQuery(alias) : ''
      }`;
    };

    const courseRequestsQuery = (qb: SelectQueryBuilder<SchedulePeriod>) => {
      if (schedule) {
        qb.where(`ScheduleId <> ${schedule.schedule_id}`);
      }
      return qb;
    };

    const qb = await this.repo
      .createQueryBuilder('period')
      .leftJoinAndSelect(
        'period.Subjects',
        'Subjects',
        `Subjects.allow_request = ${true} AND Subjects.is_active = ${true}`,
      )
      .leftJoinAndSelect('Subjects.Titles', 'Titles', `${titleCourseQuery('Titles')}`)
      .leftJoinAndSelect('Titles.Courses', 'Courses', `${titleCourseQuery('Courses')}`)
      .loadRelationCountAndMap(
        'Courses.TotalRequests',
        'Courses.SchedulePeriods',
        'CoursesSchedulePeriods',
        courseRequestsQuery,
      )
      .where({ school_year_id: schoolYearId, archived: false });
    if (diplomaQuery('period')) qb.andWhere(diplomaQuery('period'));
    if (isGradeFilter) {
      qb.andWhere(`period.min_grade <= ${numericGrade} AND period.max_grade >= ${numericGrade}`);
    }

    const result = await qb.getMany();
    result.map((period) => {
      period.Subjects.map((subject) => {
        subject.Titles.map((title) => {
          const filteredCourses = this.filterCourses(title.Courses, numericGrade, isGradeFilter);
          title.Courses = filteredCourses.courses;
          title.AltCourses = filteredCourses.altCourses;
        });

        const filteredTitles = this.filterTitles(subject.Titles, numericGrade, isGradeFilter);
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
