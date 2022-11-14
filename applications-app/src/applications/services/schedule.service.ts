import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Schedule } from '../models/schedule.entity';
import { CreateOrUpdateScheduleInput } from '../dto/create-or-update-schedule.inputs';
import { SchedulesArgs } from '../dto/schedules.args';
import { Pagination } from 'src/paginate';
import { Provider } from '../models/provider.entity';
import { EmailScheduleInput } from '../dto/email-schedule.input';
import { ScheduleEmail } from '../models/schedule-email.entity';
import { UserRegion } from '../models/user-region.entity';
import { UserRegionService } from './user-region.service';
import { EmailTemplatesService } from './email-templates.service';
import { EmailsService } from './emails.service';
import { ScheduleEmailsService } from './schedule-emails.service';
import { EmailUpdateRequiredInput } from '../dto/email-update-required.inputs';
import { StudentsService } from './students.service';
import { SchoolYearService } from './schoolyear.service';
import * as Moment from 'moment';
import { ResponseDTO } from '../dto/response.dto';
import { ScheduleHistory } from '../models/schedule-history.entity';
import { ScheduleStatus } from '../enums';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
    @InjectRepository(ScheduleHistory)
    private readonly historyRepo: Repository<ScheduleHistory>,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private sesEmailService: EmailsService,
    private scheduleEmailsService: ScheduleEmailsService,
    private studentService: StudentsService,
    private schoolYearService: SchoolYearService,
  ) {}

  async findAll(schedulesArgs: SchedulesArgs): Promise<Pagination<Schedule>> {
    const { skip, take, sort, filter, search, region_id } = schedulesArgs;
    const _sortBy = sort.split('|');

    const qb = this.repo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.ScheduleStudent', 'student')
      .leftJoinAndSelect('schedule.ScheduleEmails', 'ScheduleEmails')
      .leftJoinAndSelect('schedule.SchoolYear', 'schoolYear')
      .leftJoinAndSelect('schedule.SchedulePeriods', 'SchedulePeriods')
      .leftJoinAndMapOne('SchedulePeriods.Provider', Provider, 'provider', 'provider.id = SchedulePeriods.ProviderId')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .andWhere(`schoolYear.RegionId = ${region_id}`)
      .andWhere(`schedule.status <> 'Draft'`);

    if (filter && filter.status && filter.status.length > 0) {
      qb.andWhere('schedule.status IN (:status)', { status: filter.status });
    }
    if (filter && filter.grades && filter.grades.length > 0) {
      qb.andWhere('student.grade_level IN (:grades)', { grades: filter.grades });
    }
    if (filter && filter.diplomaSeeking) {
      qb.andWhere(`student.diploma_seeking = ${filter.diplomaSeeking}`);
    }
    if (filter && filter.selectedYearId) {
      qb.andWhere(`schoolYear.school_year_id = ${filter.selectedYearId}`);
    }
    if (filter && filter.courseType.length > 0) {
      qb.andWhere(`SchedulePeriods.course_type IN (:...courseType)`, { courseType: filter.courseType });
    }
    if (filter && filter.curriculumProviders.length > 0) {
      qb.andWhere(`Provider.name IN (:...curriculumProvider)`, { curriculumProvider: filter.curriculumProviders });
    }

    if (search) {
      const date = search
        .split('/')
        .filter((v) => v)
        .join('-');
      qb.andWhere(
        new Brackets((sub) => {
          if (
            search.indexOf('st') > -1 ||
            search.indexOf('th') > -1 ||
            search.indexOf('rd') > -1 ||
            search.indexOf('nd') > -1
          ) {
            sub.where('grade_levels.grade_level like :text', {
              text: `%${search.match(/\d+/)[0]}%`,
            });
          } else {
            sub
              .orWhere('schedule.status like :text', { text: `%${search}%` })
              .orWhere('person.first_name like :text', {
                text: `%${search}%`,
              })
              .orWhere('person.last_name like :text', { text: `%${search}%` })
              .orWhere('p_person.first_name like :text', {
                text: `%${search}%`,
              })
              .orWhere('p_person.last_name like :text', { text: `%${search}%` })
              .orWhere('ScheduleEmails.created_at like :text', { text: `%${date}%` });
            if (Moment(search, 'MM/DD/YY', true).isValid()) {
              sub.orWhere('ScheduleEmails.created_at like :text', {
                text: `%${Moment(search).format('YYYY-MM-DD')}%`,
              });
            }
          }
        }),
      );
    }

    if (sort) {
      if (_sortBy[1].toLocaleLowerCase() === 'desc') {
        if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
          qb.orderBy('grade_levels.grade_level', 'DESC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`ScheduleEmails.created_at`, 'DESC');
        } else if (_sortBy[0] === 'diploma') {
          qb.orderBy(`student.diploma_seeking`, 'DESC');
        } else {
          qb.orderBy('schedule.status', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
          qb.orderBy('student_grade_level', 'ASC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`ScheduleEmails.created_at`, 'ASC');
        } else if (_sortBy[0] === 'diploma') {
          qb.orderBy(`student.diploma_seeking`, 'ASC');
        } else {
          qb.orderBy('schedule.status', 'ASC');
        }
      }
    }

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<Schedule>({
      results,
      total,
    });
  }

  async sendUpdateReqiredEmail(updateRequiredEmail: EmailUpdateRequiredInput): Promise<boolean> {
    const { student_id, from, subject, body, region_id } = updateRequiredEmail;
    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion('Updates Required', region_id);
    const studentInfo = await this.studentService.findOneById(student_id);
    const schoolYear = await this.schoolYearService.findOneById(studentInfo?.student_grade_level?.school_year_id);
    const yearbegin = Moment(schoolYear?.date_begin).format('YYYY');
    const yearend = Moment(schoolYear?.date_end).format('YYYY');
    const yearText = schoolYear?.midyear_application
      ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
      : `${yearbegin}-${yearend.substring(2, 4)}`;
    await this.sesEmailService.sendEmail({
      email: studentInfo?.parent?.person?.email,
      subject: subject
        .toString()
        .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
        .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[SCHEDULE_YEAR\]/g, yearText),
      content: body
        .toString()
        .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
        .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[SCHEDULE_YEAR\]/g, yearText),
      from: from,
      bcc: emailTemplate.bcc,
      region_id,
      template_name: 'Updates Required',
    });
    return true;
  }

  async sendEmail(emailScheduleInput: EmailScheduleInput): Promise<ScheduleEmail[]> {
    const { schedule_ids, subject, body } = emailScheduleInput;
    const [results, total] = await this.repo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.ScheduleStudent', 'ScheduleStudent')
      .leftJoinAndSelect('schedule.SchoolYear', 'SchoolYear')
      .leftJoinAndSelect('ScheduleStudent.person', 'person')
      .leftJoinAndSelect('ScheduleStudent.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .whereInIds(schedule_ids)
      .getManyAndCount();

    const user_id = results[0].ScheduleStudent.parent.person.user_id;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion('Schedules Page', region_id);

    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(emailTemplate.id, emailTemplate.from, subject, body);
    }

    const setEmailBodyInfo = (student, school_year, schedule) => {
      const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      const yearText = schedule.midyear_application
        ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
        : `${yearbegin}-${yearend.substring(2, 4)}`;

      return emailTemplate.body
        .toString()
        .replace(/\[STUDENT\]/g, student.person?.first_name)
        .replace(/\[PARENT\]/g, student.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[SCHEDULE_YEAR\]/g, yearText);
    };

    const setEmailSubjectInfo = (student, school_year, schedule) => {
      const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      const yearText = schedule.midyear_schedule
        ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
        : `${yearbegin}-${yearend.substring(2, 4)}`;

      return emailTemplate.subject
        .toString()
        .replace(/\[STUDENT\]/g, student.person?.first_name)
        .replace(/\[PARENT\]/g, student.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[SCHEDULE_YEAR\]/g, yearText);
    };

    for (let index = 0; index < results.length; index++) {
      const item = results[index];
      const emailBody = setEmailBodyInfo(item.ScheduleStudent, item.SchoolYear, item);
      const emailSubject = setEmailSubjectInfo(item.ScheduleStudent, item.SchoolYear, item);

      await this.sesEmailService.sendEmail({
        email: item.ScheduleStudent.parent.person.email,
        subject: emailSubject,
        content: emailBody,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
        region_id,
        template_name: 'Schedule Page',
      });
    }

    const scheduleEmails = Promise.all(
      schedule_ids.map(async (id) => {
        return await this.scheduleEmailsService.create({
          schedule_id: id,
          subject: subject,
          body: body,
          from_email: emailTemplate.from,
        });
      }),
    );
    return scheduleEmails;
  }

  async find(schoolYearId: number): Promise<Schedule[]> {
    const qb = this.repo.createQueryBuilder('Schedule').where({ SchoolYearId: schoolYearId });
    return await qb.getMany();
  }

  async findOneByScheduleId(scheduleId: number): Promise<Schedule> {
    const result = await this.repo.findOne({ schedule_id: scheduleId });
    return result;
  }

  async findHistory(studentId: number, schoolYearId: number): Promise<ScheduleHistory> {
    const result = this.historyRepo
      .createQueryBuilder('ScheduleHistory')
      .where({ StudentId: studentId, SchoolYearId: schoolYearId })
      .orderBy('schedule_history_id', 'DESC')
      .getOne();
    return result;
  }

  async save(scheduleInput: CreateOrUpdateScheduleInput): Promise<Schedule> {
    try {
      let result: Schedule = null;
      if (scheduleInput.status === ScheduleStatus.ACCEPTED) {
        result = await this.repo.save({
          ...scheduleInput,
          date_accepted: new Date(),
        });
        await this.historyRepo.save({
          ...scheduleInput,
          date_accepted: new Date(),
        });
      } else {
        result = await this.repo.save({
          ...scheduleInput,
          date_submitted: scheduleInput?.status === ScheduleStatus.SUBMITTED ? new Date() : null,
        });
      }

      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(scheduleId: number): Promise<boolean> {
    try {
      await this.repo.save({ schedule_id: scheduleId });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getScheduleCountGroup(): Promise<ResponseDTO> {
    const qb = await this.repo.query(
      `SELECT status , COUNT(*) AS count FROM mth_schedule WHERE status <> "Draft" GROUP BY status`,
    );
    const statusArray = {
      'Updates Required': 0,
      'Updates Requested': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Not Submitted': 0,
      Accepted: 0,
    };
    qb.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async getScheduleCountByRegionId(region_id: number): Promise<ResponseDTO> {
    const qb = await this.repo.query(
      `SELECT
          t1.status AS status,
          COUNT(*) AS count 
        FROM
          ( SELECT * FROM infocenter.mth_schedule WHERE status <> "Draft" ) AS t1
          LEFT JOIN infocenter.mth_application application ON ( application.student_id = t1.StudentId )
          LEFT JOIN infocenter.mth_schoolyear schoolYear ON ( schoolYear.school_year_id = application.school_year_id ) 
        WHERE
          schoolYear.RegionId = ${region_id}
        GROUP BY
          t1.status`,
    );
    const statusArray = {
      'Updates Required': 0,
      'Updates Requested': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Not Submitted': 0,
      Accepted: 0,
    };
    qb.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }
}
