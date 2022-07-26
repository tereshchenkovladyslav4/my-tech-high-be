import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ApplicationEvent } from '../models/event.entity';
import { CreateOrUpdateEventInput } from '../dto/create-or-update-event.inputs';
import { FindEventsByRegionIdSearch } from '../dto/find-event-by-regionId-search';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(ApplicationEvent)
    private readonly eventsRepository: Repository<ApplicationEvent>,
  ) {}

  async findAll(
    param: FindEventsByRegionIdSearch,
  ): Promise<Array<ApplicationEvent>> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      let subCond = '';
      if (param.search_field) {
        let filter_grades = '';
        const grades = await queryRunner.query(`
          SELECT
            grade.grade_level
          FROM(
            SELECT person_id FROM infocenter.mth_person WHERE user_id = ${param.parent_id}
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
              grade.grade_level.includes('K')
                ? 'Kindergarten'
                : grade.grade_level
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
        ORDER BY events.start_date, events.end_date, eventType.priority
      `);
      const results: ApplicationEvent[] = events.map((event) => ({
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
      }));
      queryRunner.release();
      return results;
    } catch (error) {
      return [];
    }
  }

  async save(
    createEventInput: CreateOrUpdateEventInput,
  ): Promise<ApplicationEvent> {
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
