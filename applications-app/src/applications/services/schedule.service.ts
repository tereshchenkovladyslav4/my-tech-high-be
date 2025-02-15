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
import { EmailUpdatesRequiredInput } from '../dto/email-update-required.inputs';
import { StudentsService } from './students.service';
import { StudentStatusService } from './student-status.service';
import { SchoolYearService } from './schoolyear.service';
import * as Moment from 'moment';
import { ResponseDTO } from '../dto/response.dto';
import { ScheduleHistory } from '../models/schedule-history.entity';
import { EmailTemplateEnum, ScheduleStatus, SEMESTER_TYPE, StudentStatusEnum } from '../enums';
import { SchedulesGroupCountArgs } from '../dto/schedules-group-count.args';
import { EmailUpdatesAllowedInput } from '../dto/email-update-allowed.inputs';
import { TimezonesService } from './timezones.service';
import { UsersService } from './users.service';

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
    private studentStatusService: StudentStatusService,
    private schoolYearService: SchoolYearService,
    private timezoneService: TimezonesService,
    private userService: UsersService,
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
      .andWhere(`schedule.status <> '${ScheduleStatus.DRAFT}'`)
      .andWhere('schedule.status IN (:status)', { status: filter.status });

    if (filter && filter.grades && filter.grades.length > 0) {
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: filter.grades });
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
      qb.andWhere(`SchedulePeriods.ProviderId IN (:...curriculumProvider)`, {
        curriculumProvider: filter.curriculumProviders,
      });
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
          qb.orderBy('student_grade_level', 'DESC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`ScheduleEmails.created_at`, 'DESC');
        } else if (_sortBy[0] === 'diploma') {
          qb.orderBy(`student.diploma_seeking`, 'DESC');
        } else if (_sortBy[0] === 'date') {
          qb.orderBy(`schedule.date_accepted`, 'DESC').addOrderBy(`schedule.date_submitted`, 'DESC');
          // qb.addOrderBy(`schedule.date_accepted`, 'DESC');
        } else if (_sortBy[0] === 'student') {
          qb.orderBy('person.first_name', 'DESC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.first_name, ' ', p_person.last_name)", 'parent_name');
          qb.orderBy('parent_name', 'DESC');
        } else {
          qb.orderBy('schedule.status', 'DESC');
          qb.addOrderBy('schedule.last_modified', 'ASC');
          qb.addOrderBy('schedule.date_submitted', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
          qb.orderBy('student_grade_level', 'ASC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`ScheduleEmails.created_at`, 'ASC');
        } else if (_sortBy[0] === 'diploma') {
          qb.orderBy(`student.diploma_seeking`, 'ASC');
        } else if (_sortBy[0] === 'date') {
          qb.orderBy(`schedule.date_accepted`, 'ASC').addOrderBy(`schedule.date_submitted`, 'ASC');
        } else if (_sortBy[0] === 'student') {
          qb.orderBy('person.first_name', 'ASC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.first_name, ' ', p_person.last_name)", 'parent_name');
          qb.orderBy('parent_name', 'ASC');
        } else {
          qb.orderBy('schedule.status', 'ASC');
          qb.addOrderBy('schedule.last_modified', 'ASC');
          qb.addOrderBy('schedule.date_submitted', 'DESC');
        }
      }
    }

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<Schedule>({
      results,
      total,
    });
  }

  async sendUpdatesReqiredEmail(updateRequiredEmail: EmailUpdatesRequiredInput): Promise<boolean> {
    try {
      const { student_id, from, subject, body, region_id, schedule_id } = updateRequiredEmail;
      const studentInfo = await this.studentService.findOneById(student_id);
      const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
        EmailTemplateEnum.UPDATES_REQUIRED,
        studentInfo?.student_grade_level?.school_year_id,
        studentInfo?.applications?.find(
          (application) => application.school_year_id == studentInfo?.student_grade_level?.school_year_id,
        )?.midyear_application,
      );
      if (emailTemplate) {
        const schoolYear = await this.schoolYearService.findOneById(studentInfo?.student_grade_level?.school_year_id);
        const yearbegin = Moment(schoolYear?.date_begin).format('YYYY');
        const yearend = Moment(schoolYear?.date_end).format('YYYY');
        const yearText = studentInfo?.applications?.find(
          (application) => application.school_year_id == schoolYear.school_year_id,
        )?.midyear_application
          ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
          : `${yearbegin}-${yearend.substring(2, 4)}`;
        const email_subject = subject
          .toString()
          .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
          .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[SCHEDULE_YEAR\]/g, yearText);
        const email_body = body
          .toString()
          .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
          .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[SCHEDULE_YEAR\]/g, yearText);
        const parentUserInfo = await this.userService.findOneById(studentInfo?.parent?.person?.user_id);
        await this.sesEmailService.sendEmail({
          email: parentUserInfo?.email,
          subject: email_subject,
          content: email_body,
          from: from,
          bcc: emailTemplate.bcc,
          region_id,
          template_name: EmailTemplateEnum.UPDATES_REQUIRED,
        });
        await this.scheduleEmailsService.create({
          schedule_id: schedule_id,
          subject: email_subject,
          body: email_body,
          from_email: from,
          template_name: EmailTemplateEnum.UPDATES_REQUIRED,
        });
      }
      return true;
    } catch (error) {
      return error;
    }
  }

  async sendUpdatesAllowedEmail(updateRequiredEmail: EmailUpdatesAllowedInput): Promise<boolean> {
    try {
      const { student_id, region_id, schedule_id } = updateRequiredEmail;
      const studentInfo = await this.studentService.findOneById(student_id);
      const parentUserInfo = await this.userService.findOneById(studentInfo?.parent?.person?.user_id);
      const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
        EmailTemplateEnum.UPDATES_ALLOWED,
        studentInfo?.student_grade_level?.school_year_id,
        studentInfo?.applications?.find(
          (application) => application.school_year_id == studentInfo?.student_grade_level?.school_year_id,
        )?.midyear_application,
      );
      if (emailTemplate) {
        const studentInfo = await this.studentService.findOneById(student_id);
        const schoolYear = await this.schoolYearService.findOneById(studentInfo?.student_grade_level?.school_year_id);
        const yearbegin = Moment(schoolYear?.date_begin).format('YYYY');
        const yearend = Moment(schoolYear?.date_end).format('YYYY');
        const yearText = studentInfo?.applications?.find(
          (application) => application.school_year_id == schoolYear.school_year_id,
        )?.midyear_application
          ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
          : `${yearbegin}-${yearend.substring(2, 4)}`;
        const email_subject = emailTemplate.subject
          .toString()
          .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
          .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[SCHEDULE_YEAR\]/g, yearText);
        const email_body = emailTemplate.body
          .toString()
          .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
          .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[SCHEDULE_YEAR\]/g, yearText);
        await this.sesEmailService.sendEmail({
          email: parentUserInfo?.email,
          subject: email_subject,
          content: email_body,
          from: emailTemplate.from,
          bcc: emailTemplate.bcc,
          region_id,
          template_name: EmailTemplateEnum.UPDATES_ALLOWED,
        });
        await this.scheduleEmailsService.create({
          schedule_id: schedule_id,
          subject: email_subject,
          body: email_body,
          from_email: emailTemplate.from,
          template_name: EmailTemplateEnum.UPDATES_ALLOWED,
        });
      }
      return true;
    } catch (error) {
      return error;
    }
  }

  async sendEmail(emailScheduleInput: EmailScheduleInput): Promise<ScheduleEmail[]> {
    try {
      const { schedule_ids, schedule_status, subject, body, from, region_id } = emailScheduleInput;
      const qb = this.repo
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.ScheduleStudent', 'ScheduleStudent')
        .leftJoinAndSelect('schedule.SchoolYear', 'schoolYear')
        .leftJoinAndSelect('ScheduleStudent.person', 'person')
        .leftJoinAndSelect('ScheduleStudent.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .andWhere(`schoolYear.RegionId = ${region_id}`);
      if (schedule_ids && schedule_ids.length > 0) {
        qb.whereInIds(schedule_ids);
      }
      if (schedule_status && schedule_status.length > 0) {
        qb.andWhere('schedule.status IN (:status)', { status: schedule_status });
      }
      const [results] = await qb.getManyAndCount();
      if (results && results.length > 0) {
        Promise.all(
          results.map(async (item) => {
            await this.sesEmailService.sendEmail({
              email: item.ScheduleStudent.parent.person.email,
              subject: subject.toString(),
              content: body.toString(),
              from,
              region_id,
              template_name: 'Schedule Page',
            });
          }),
        );

        let newScheduleIds = [];
        if (schedule_ids && schedule_ids.length > 0) {
          newScheduleIds = schedule_ids;
        }
        if (schedule_status && schedule_status.length > 0) {
          newScheduleIds = results.map((ret) => {
            return ret.schedule_id;
          });
        }

        if (newScheduleIds.length > 0) {
          const scheduleEmails = Promise.all(
            newScheduleIds.map(async (id) => {
              return await this.scheduleEmailsService.create({
                schedule_id: +id,
                subject: subject,
                body: body,
                from_email: from,
                template_name: 'Schedule Page',
              });
            }),
          );
          return scheduleEmails;
        }
        return null;
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  async find(schoolYearId: number): Promise<Schedule[]> {
    const qb = this.repo.createQueryBuilder('Schedule').where({ SchoolYearId: schoolYearId });
    return await qb.getMany();
  }

  async findOneByScheduleId(scheduleId: number): Promise<Schedule> {
    const result = await this.repo.findOne({ schedule_id: scheduleId });
    return result;
  }

  async getScheduleIdByScheduleHistoryId(scheduleHistoryId: number): Promise<number> {
    try {
      const scheduleHistory = await this.historyRepo.findOne({ schedule_history_id: scheduleHistoryId });
      const schedule = await this.repo.findOne({
        StudentId: scheduleHistory?.StudentId,
        SchoolYearId: scheduleHistory?.SchoolYearId,
        is_second_semester: scheduleHistory?.is_second_semester,
      });
      return schedule?.schedule_id || 0;
    } catch (error) {
      return error;
    }
  }

  async deleteScheduleHistory(scheduleHistoryId: number): Promise<boolean> {
    try {
      await this.historyRepo.delete({ schedule_history_id: scheduleHistoryId });
      return true;
    } catch (error) {
      return false;
    }
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
      if (scheduleInput.status !== ScheduleStatus.DRAFT)
        await this.repo.delete({
          StudentId: scheduleInput.StudentId,
          SchoolYearId: scheduleInput.SchoolYearId,
          status: ScheduleStatus.NOT_SUBMITTED,
        });
      if (scheduleInput.status === ScheduleStatus.ACCEPTED) {
        result = await this.repo.save({
          ...scheduleInput,
          date_accepted: new Date(),
          last_modified: new Date(),
        });
        await this.historyRepo.save({
          ...scheduleInput,
          date_accepted: new Date(),
          last_modified: new Date(),
        });

        const student_id = scheduleInput.StudentId ? scheduleInput.StudentId : result.StudentId;
        const school_year_id = scheduleInput.SchoolYearId ? scheduleInput.SchoolYearId : result.SchoolYearId;

        await this.studentStatusService.update({
          student_id: student_id,
          status: StudentStatusEnum.ACTIVE,
          school_year_id: school_year_id,
        });

        if (scheduleInput.is_sending_email) {
          // Sending Accepted Email To Parent
          const studentInfo = await this.studentService.findOneById(student_id);
          const parentUserInfo = await this.userService.findOneById(studentInfo.parent?.person?.user_id);
          const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(
            studentInfo.parent?.person?.user_id,
          );

          let region_id = 1;
          if (regions.length != 0) {
            region_id = regions[0].region_id;
          }

          const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
            scheduleInput.is_second_semester
              ? EmailTemplateEnum.SECOND_SEMESTER_ACCEPTED
              : EmailTemplateEnum.SCHEDULE_ACCEPTED,
            school_year_id,
            studentInfo?.applications?.find((application) => application.school_year_id == school_year_id)
              ?.midyear_application,
          );
          if (emailTemplate) {
            const schoolYear = await this.schoolYearService.findOneById(
              studentInfo?.student_grade_level?.school_year_id,
            );
            const yearbegin = Moment(schoolYear?.date_begin).format('YYYY');
            const yearend = Moment(schoolYear?.date_end).format('YYYY');
            const yearText = studentInfo?.applications?.find(
              (application) => application.school_year_id == schoolYear.school_year_id,
            )?.midyear_application
              ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
              : `${yearbegin}-${yearend.substring(2, 4)}`;
            const email_subject = emailTemplate.subject
              .toString()
              .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
              .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[SCHEDULE_YEAR\]/g, yearText);
            const email_body = emailTemplate.body
              .toString()
              .replace(/\[STUDENT\]/g, studentInfo.person?.first_name)
              .replace(/\[PARENT\]/g, studentInfo.parent?.person?.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[SCHEDULE_YEAR\]/g, yearText);

            await this.sesEmailService.sendEmail({
              email: parentUserInfo?.email,
              subject: email_subject,
              content: email_body,
              from: emailTemplate.from,
              bcc: emailTemplate.bcc,
              region_id,
              template_name: scheduleInput.is_second_semester
                ? EmailTemplateEnum.SECOND_SEMESTER_ACCEPTED
                : EmailTemplateEnum.SCHEDULE_ACCEPTED,
            });

            await this.scheduleEmailsService.create({
              schedule_id: result?.schedule_id,
              subject: email_subject,
              body: email_body,
              from_email: emailTemplate.from,
              template_name: scheduleInput.is_second_semester
                ? EmailTemplateEnum.SECOND_SEMESTER_ACCEPTED
                : EmailTemplateEnum.SCHEDULE_ACCEPTED,
            });
          }
        }
      } else if (scheduleInput.status === ScheduleStatus.NOT_SUBMITTED) {
        const existingSchedule = await this.repo.findOne({
          StudentId: scheduleInput.StudentId,
          SchoolYearId: scheduleInput.SchoolYearId,
          status: ScheduleStatus.NOT_SUBMITTED,
        });
        if (existingSchedule) {
          return existingSchedule;
        } else {
          result = await this.repo.save({
            ...scheduleInput,
            date_submitted: new Date(),
            last_modified: new Date(),
          });
        }
      } else {
        const existingSchedule = scheduleInput.schedule_id ? await this.repo.findOne(scheduleInput.schedule_id) : null;
        result = await this.repo.save({
          ...scheduleInput,
          date_submitted: existingSchedule?.date_submitted || new Date(),
          last_modified: new Date(),
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
      `SELECT status , COUNT(*) AS count FROM mth_schedule WHERE status <> "${ScheduleStatus.DRAFT}" GROUP BY status`,
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

  async getScheduleCountByRegionId(scheduleGroup: SchedulesGroupCountArgs): Promise<ResponseDTO> {
    const { filter, region_id } = scheduleGroup;
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
      .andWhere(`schedule.status <> '${ScheduleStatus.DRAFT}'`);

    if (filter && filter.grades && filter.grades.length > 0) {
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: filter.grades });
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
      qb.andWhere(`SchedulePeriods.ProviderId IN (:...curriculumProvider)`, {
        curriculumProvider: filter.curriculumProviders,
      });
    }
    qb.select('schedule.status');
    const [result] = await qb.getManyAndCount();

    const statusArray = {
      'Updates Required': 0,
      'Updates Requested': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Not Submitted': 0,
      Accepted: 0,
    };
    result.map((item) => {
      statusArray[item.status] = statusArray[item.status] + 1;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async runSecondSemesterUnlocked(): Promise<string> {
    try {
      const schedules = await this.repo
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.ScheduleStudent', 'student')
        .leftJoinAndSelect(
          'schedule.ScheduleEmails',
          'ScheduleEmails',
          `ScheduleEmails.template_name = '${EmailTemplateEnum.SECOND_SEMESTER_UNLOCKED}'`,
        )
        .leftJoinAndSelect('schedule.SchoolYear', 'schoolYear')
        .leftJoinAndSelect('schedule.SchedulePeriods', 'SchedulePeriods')
        .leftJoin('SchedulePeriods.Period', 'Period', `Period.semester <> '${SEMESTER_TYPE.NONE}'`)
        .leftJoinAndSelect('student.person', 'person')
        .leftJoinAndSelect('student.grade_levels', 'grade_levels')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .where(`schedule.status = '${ScheduleStatus.ACCEPTED}'`)
        .andWhere(`(schedule.is_second_semester = 0 OR schedule.is_second_semester IS NULL)`)
        .andWhere(`Period.id IS NOT NULL`)
        .andWhere('ScheduleEmails.schedule_email_id IS NULL')
        .getMany();
      schedules?.map(async (schedule) => {
        const region_id = schedule?.SchoolYear?.RegionId;
        const school_year_id = schedule?.SchoolYear?.school_year_id;
        const now = await this.timezoneService.getTimezoneDate(region_id);
        if (schedule?.SchoolYear?.second_semester_open <= now && schedule?.SchoolYear?.second_semester_close >= now) {
          const studentInfo = await this.studentService.findOneById(schedule?.ScheduleStudent?.student_id);
          const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
            EmailTemplateEnum.SECOND_SEMESTER_UNLOCKED,
            school_year_id,
            studentInfo?.applications?.find((application) => application.school_year_id == school_year_id)
              ?.midyear_application,
          );

          if (emailTemplate) {
            const yearbegin = Moment(schedule?.SchoolYear?.date_begin).format('YYYY');
            const yearend = Moment(schedule?.SchoolYear?.date_end).format('YYYY');
            const yearText = studentInfo?.applications?.find(
              (application) => application.school_year_id == schedule?.SchoolYear?.school_year_id,
            )?.midyear_application
              ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
              : `${yearbegin}-${yearend.substring(2, 4)}`;
            const email_subject = emailTemplate.subject
              .toString()
              .replace(/\[STUDENT\]/g, schedule?.ScheduleStudent?.person?.first_name)
              .replace(/\[PARENT\]/g, schedule?.ScheduleStudent?.parent?.person?.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[SCHEDULE_YEAR\]/g, yearText);
            const email_body = emailTemplate.body
              .toString()
              .replace(/\[STUDENT\]/g, schedule?.ScheduleStudent?.person?.first_name)
              .replace(/\[PARENT\]/g, schedule?.ScheduleStudent?.parent?.person?.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[SCHEDULE_YEAR\]/g, yearText);
            const parentUserInfo = await this.userService.findOneById(
              schedule?.ScheduleStudent?.parent?.person?.user_id,
            );
            await this.sesEmailService.sendEmail({
              email: parentUserInfo?.email,
              subject: email_subject,
              content: email_body,
              from: emailTemplate.from,
              bcc: emailTemplate.bcc,
              region_id,
              template_name: EmailTemplateEnum.SECOND_SEMESTER_UNLOCKED,
            });
            await this.scheduleEmailsService.create({
              schedule_id: schedule?.schedule_id,
              subject: email_subject,
              body: email_body,
              from_email: emailTemplate.from,
              template_name: EmailTemplateEnum.SECOND_SEMESTER_UNLOCKED,
            });
          }
        }
      });
      return 'Successfully run schedule second semester unlocked';
    } catch (error) {
      return error;
    }
  }
}
