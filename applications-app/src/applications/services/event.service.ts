import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, createQueryBuilder } from 'typeorm';
import { ApplicationEvent } from '../models/event.entity';
import { CreateOrUpdateEventInput } from '../dto/create-or-update-event.inputs';
import { FindEventsByRegionIdSearch } from '../dto/find-event-by-regionId-search';
import { User } from '../models/user.entity';
import { Parent } from '../models/parent.entity';
import { UserRegion } from '../models/user-region.entity';
import { Person } from '../models/person.entity';
import { Student } from '../models/student.entity';
import { Application } from '../models/application.entity';
import { SchoolYearService } from './schoolyear.service';
import { TimezonesService } from './timezones.service';
import { Packet } from '../models/packet.entity';
import { StudentAssessmentOption } from '../models/student-assessment-option.entity';
import { StudentStatusEnum } from '../enums';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(ApplicationEvent)
    private readonly eventsRepository: Repository<ApplicationEvent>,
    private schoolYearsService: SchoolYearService,
    private timeZonesService: TimezonesService,
  ) {}

  async getScheduleActiveSchoolYears(region_id: number): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(region_id);
    let _activeSchoolYears = [];
    const nowDate = await this.timeZonesService.getTimezoneDate(region_id);

    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears
        .filter(
          (schoolYear) =>
            schoolYear.schedule &&
            schoolYear.schedule_builder_open <= nowDate &&
            schoolYear.schedule_builder_close >= nowDate,
        )
        .map(function (a) {
          return a.school_year_id;
        });
    }

    return _activeSchoolYears;
  }

  async getScheduleActiveMidSchoolYears(region_id: number): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(region_id);
    let _activeSchoolYears = [];
    const nowDate = await this.timeZonesService.getTimezoneDate(region_id);

    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears
        .filter(
          (schoolYear) =>
            schoolYear.schedule &&
            schoolYear.midyear_schedule_open <= nowDate &&
            schoolYear.midyear_schedule_close >= nowDate,
        )
        .map(function (a) {
          return a.school_year_id;
        });
    }

    return _activeSchoolYears;
  }

  async findAll(param: FindEventsByRegionIdSearch): Promise<Array<ApplicationEvent>> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      let subCond = '';
      if (param.search_field) {
        let filter_grades = '';
        const grades = await queryRunner.query(`
          SELECT
            grade.grade_level
          FROM(
            SELECT person_id FROM infocenter.mth_person WHERE user_id = ${param.user_id}
          ) AS parent
          LEFT JOIN infocenter.mth_parent parentInfo ON (parentInfo.person_id = parent.person_id)
          LEFT JOIN infocenter.mth_student studentInfo ON (studentInfo.parent_id = parentInfo.parent_id)
          LEFT JOIN infocenter.mth_person student ON (student.person_id = studentInfo.person_id)
          LEFT JOIN infocenter.mth_student_grade_level grade ON (grade.student_id = studentInfo.student_id)
          WHERE CONCAT(student.first_name, student.last_name) LIKE '%${param.search_field}%' OR CONCAT(student.preferred_first_name, student.preferred_last_name) LIKE '%${param.search_field}%'
        `);
        if (grades) {
          grades.forEach((grade) => {
            filter_grades += ` OR events.filter_grades LIKE '%"${
              grade.grade_level.includes('K') ? 'Kindergarten' : grade.grade_level
            }"%'`;
          });
        }
        subCond = `AND (events.title like '%${param.search_field}%' OR events.description like '%${param.search_field}%' ${filter_grades})`;
      }

      const events = await queryRunner.query(`
        SELECT
          eventType.*, events.*, eventType.created_at AS eventType_created_at, eventType.updated_at AS eventType_updated_at
        FROM(
          SELECT * FROM infocenter.mth_event
        ) AS events
        LEFT JOIN infocenter.mth_event_type eventType ON(eventType.event_type_id = events.TypeId)
        WHERE eventType.RegionId = ${param.region_id} ${subCond} 
      `);

      const results = [];
      if (param.type === 'student') {
        const student = (await createQueryBuilder(Student)
          .innerJoinAndSelect(Person, 'person', 'person.person_id = `Student`.person_id')
          .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
          .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
          .where('user.user_id = :userId', { userId: param.user_id })
          .printSql()
          .getRawOne()) as Student;

        events.forEach((event) => {
          const users = JSON.parse(event.filter_users);
          const grades = JSON.parse(event.filter_grades);
          if (users.includes('students') || users.includes('2')) {
            if (grades.includes(student.student_grade_level.grade_level)) {
              results.push(event);
            }
          }
        });
      } else if (param.type === 'parent') {
        const parent = await createQueryBuilder(Parent)
          .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
          .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
          .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
          .where('user.user_id = :userId', { userId: param.user_id })
          .printSql()
          .getRawOne();

        const { userRegion_region_id, Parent_parent_id } = parent;
        const scheduledActiveSchoolYears = await this.getScheduleActiveSchoolYears(userRegion_region_id);
        const scheduleActiveMidSchoolYears = await this.getScheduleActiveMidSchoolYears(userRegion_region_id);

        const students = await createQueryBuilder(Student)
          .leftJoin('Student.status', 'studentStatus')
          .innerJoin(
            Application,
            'application',
            "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND (application.midyear_application = 0 AND application.school_year_id IN (:schoolYears) || application.midyear_application = 1 AND application.school_year_id IN (:midSchoolYears))",
            {
              schoolYears: scheduledActiveSchoolYears.length ? scheduledActiveSchoolYears : [0],
              midSchoolYears: scheduleActiveMidSchoolYears.length ? scheduleActiveMidSchoolYears : [0],
            },
          )
          .innerJoin(
            Packet,
            'packet',
            "packet.student_id = `Student`.student_id AND packet.status = 'Accepted' AND packet.deleted = 0",
          )
          .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
          .andWhere(`studentStatus.status <> ${StudentStatusEnum.WITHDRAWN}`)
          .orderBy('application.application_id', 'DESC')
          .printSql()
          .getMany();

        const studentIds = students.map((student: Student) => student.student_id);

        const studentsAssessments = await createQueryBuilder('StudentAssessmentOption')
          .innerJoinAndSelect('StudentAssessmentOption.AssessmentOption', 'AssessmentOption')
          .where('StudentAssessmentOption.StudentId IN (:studentIds)', { studentIds: studentIds })
          .printSql()
          .getMany();

        const optInEvent = studentsAssessments.find(
          (assessment: StudentAssessmentOption) => assessment.AssessmentOption?.method === 'Opt-in',
        );
        const optInActive = optInEvent ? true : false;

        const optOutEvent = studentsAssessments.find(
          (assessment: StudentAssessmentOption) => assessment.AssessmentOption?.method === 'Opt-out',
        );
        const optOutActive = optOutEvent ? true : false;

        events.map((event) => {
          const users = JSON.parse(event.filter_users);
          const optFilter = JSON.parse(event.filter_other);
          if (users.includes('parent/observers') || users.includes('1')) {
            if (
              (optFilter.indexOf('testing-opt-in') !== -1 && optInActive) ||
              (optFilter.indexOf('testing-opt-out') !== -1 && optOutActive) ||
              (optFilter.indexOf('testing-opt-in') !== -1 &&
                optFilter.indexOf('testing-opt-out') !== -1 &&
                (optInActive || optOutActive)) ||
              (optFilter.indexOf('testing-opt-in') === -1 && optFilter.indexOf('testing-opt-out') === -1)
            ) {
              results.push({
                EventType: {
                  RegionId: event.region_id,
                  archived: event.archived,
                  color: event.color,
                  created_at: event.eventType_created_at,
                  event_type_id: event.event_type_id,
                  name: event.name,
                  priority: event.priority,
                  updated_at: event.eventType_updated_at,
                },
                TypeId: event.TypeId,
                description: event.description,
                end_date: event.end_date,
                event_id: event.event_id,
                all_day: event.all_day,
                start_date: event.start_date,
                title: event.title,
                filter_grades: event.filter_grades,
                filter_other: event.filter_other,
                filter_program_year: event.filter_program_year,
                filter_provider: event.filter_provider,
                filter_school_of_enrollment: event.filter_school_of_enrollment,
                filter_users: event.filter_users,
                has_rsvp: event.has_rsvp,
              });
            }
          }
        });
      } else {
        events.map((event) => {
          results.push({
            EventType: {
              RegionId: event.region_id,
              archived: event.archived,
              color: event.color,
              created_at: event.eventType_created_at,
              event_type_id: event.event_type_id,
              name: event.name,
              priority: event.priority,
              updated_at: event.eventType_updated_at,
            },
            TypeId: event.TypeId,
            description: event.description,
            end_date: event.end_date,
            event_id: event.event_id,
            all_day: event.all_day,
            start_date: event.start_date,
            title: event.title,
            filter_grades: event.filter_grades,
            filter_other: event.filter_other,
            filter_program_year: event.filter_program_year,
            filter_provider: event.filter_provider,
            filter_school_of_enrollment: event.filter_school_of_enrollment,
            filter_users: event.filter_users,
            has_rsvp: event.has_rsvp,
          });
        });
      }

      queryRunner.release();
      return results;
    } catch (error) {
      return [];
    }
  }

  async save(createEventInput: CreateOrUpdateEventInput): Promise<ApplicationEvent> {
    try {
      const result = await this.eventsRepository.save(createEventInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteById(event_id: number): Promise<boolean> {
    try {
      await this.eventsRepository.delete({ event_id: event_id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
