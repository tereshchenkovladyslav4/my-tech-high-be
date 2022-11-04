import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly repo: Repository<Schedule>,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private sesEmailService: EmailsService,
    private scheduleEmailsService: ScheduleEmailsService,
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
      .andWhere(`schoolYear.RegionId = ${region_id}`);

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
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<Schedule>({
      results,
      total,
    });
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

      const result = await this.sesEmailService.sendEmail({
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

  async save(scheduleInput: CreateOrUpdateScheduleInput): Promise<Schedule> {
    try {
      const result = await this.repo.save(scheduleInput);
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
}
