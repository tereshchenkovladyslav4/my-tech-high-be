import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, getConnection } from 'typeorm';
import { Application } from '../models/application.entity';
import { ApplicationsArgs } from '../dto/applications.args';
import { CreateStudentApplicationInput } from '../dto/new-student-application.inputs';
import { AcceptApplicationInput } from '../dto/accept-application.inputs';
import { Pagination, PaginationOptionsInterface } from '../../paginate';
import { PacketsService } from './packets.service';
import { DeleteApplicationInput } from '../dto/delete-application.inputs';
import { EmailApplicationInput } from '../dto/email-application.inputs';
import { EmailsService } from './emails.service';
import { ApplicationEmailsService } from './application-emails.service';
import { EmailRecordsService } from './email-records.service';
import { ApplicationEmail } from '../models/application-email.entity';
import { SchoolYearService } from './schoolyear.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { StudentStatusService } from './student-status.service';
import { SchoolYear } from '../models/schoolyear.entity';
import { UpdateApplicationInput } from '../dto/update-application.inputs';
import { EmailTemplatesService } from './email-templates.service';
import { StudentsService } from './students.service';
import { ResponseDTO } from '../dto/response.dto';
import { UserRegion } from '../models/user-region.entity';
import { UserRegionService } from './user-region.service';
import { PersonAddressService } from './person-address.service';
import { AddressService } from './address.service';
import * as Moment from 'moment';
import { UpdateSchoolYearIdsInput } from '../dto/school-update-application.inputs';
import { concatenateTypeDefs } from 'graphql-tools';
import { StudentRecordService } from './student-record.service';
import { EmailTemplateEnum } from '../enums';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private packetsService: PacketsService,
    private sesEmailService: EmailsService,
    private applicationEmailsService: ApplicationEmailsService,
    private schoolYearService: SchoolYearService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private emailTemplateService: EmailTemplatesService,
    private studentService: StudentsService,
    private userRegionService: UserRegionService,
    private studentStatusService: StudentStatusService,
    private personAddressService: PersonAddressService,
    private emailRecordsService: EmailRecordsService,
    private addressService: AddressService,
    private studentRecordService: StudentRecordService,
  ) {}

  async getTodoListItems(regionId: number): Promise<ResponseDTO> {
    const queryRunner = await getConnection().createQueryRunner();
    const statusArray = {
      application: 0,
      packet: 0,
      schedule: 0,
      withdrawal: 0,
      direct_order: 0,
      reimbursement: 0,
      email_errors: 0,
    };
    const results = await queryRunner.query(
      `SELECT
          'application' AS status,
          COUNT(*) AS count
        FROM (
          SELECT 
            *
            FROM infocenter.mth_application
            WHERE status = 'Submitted'
        ) AS application
        LEFT JOIN infocenter.mth_schoolyear AS schoolYear ON (schoolYear.school_year_id=application.school_year_id)
        WHERE schoolYear.RegionId = ${regionId}
        UNION
        SELECT
          'packet' AS status,
          COUNT(*) AS count
        FROM (
          SELECT * FROM infocenter.mth_packet
        ) AS t1
        LEFT JOIN infocenter.mth_application application ON (application.student_id = t1.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE schoolYear.RegionId = ${regionId} AND t1.status IN ('Age Issue', 'Resubmitted', 'Submitted')
        UNION
        SELECT
          'withdrawal' AS status,
            COUNT(*) AS count
        FROM (
          SELECT * FROM infocenter.withdrawal WHERE status = 'Requested'
        ) AS t1
        LEFT JOIN infocenter.mth_application application ON (application.student_id = t1.StudentId)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE schoolYear.RegionId = ${regionId}`,
    );

    queryRunner.release();

    results.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async findAll(applicationsArgs: ApplicationsArgs): Promise<Pagination<Application>> {
    const { skip, take, sort, filter, search, region_id } = applicationsArgs;
    const _sortBy = sort.split('|');
    const userEmails = this.applicationEmailsService.findByOrder();

    const qb = this.applicationsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.student', 'student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('p_person.email_verifier', 'email_verifier')
      .leftJoinAndSelect('application.school_year', 'school_year')
      .leftJoinAndSelect('application.application_emails', 'application_emails')
      .leftJoinAndSelect('application.application_emails', '(' + userEmails + ')')
      .where('application.status = "Submitted"')
      .andWhere('student.student_id IS NOT NULL')
      .andWhere(`school_year.RegionId = ${region_id}`);
    if (filter?.grades?.length > 0) {
      const grades = [];
      filter.grades
        .filter((item) => item.indexOf('-') > -1)
        .map((item) => {
          for (let i = +item.split('-')[0]; i <= +item.split('-')[1]; i++) {
            if (!grades.includes(i)) {
              grades.push(i.toString());
            }
          }
        });
      filter.grades
        .filter((item) => item.indexOf('-') === -1)
        .map((item) => {
          if (!grades.includes(item)) {
            grades.push(item);
          }
          if (item == 'K') {
            if (!grades.includes('Kin')) grades.push('Kin');
          }
          if (item === 'Kindergarten') {
            if (!grades.includes('Kin')) grades.push('Kin');
            if (!grades.includes('K')) grades.push('K');
          }
        });
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: grades });
    }
    if (filter && filter.diplomaSeeking) {
      qb.andWhere(`student.diploma_seeking = ${filter.diplomaSeeking}`);
    }
    if (filter && filter.selectedYearId) {
      qb.andWhere(`application.school_year_id = ${filter.selectedYearId}`);
    }
    if (filter && filter.schoolYear && filter.schoolYear.length > 0) {
      qb.andWhere(
        new Brackets((sub) => {
          filter.schoolYear.map((item) => {
            if (item.indexOf('midyear') > 0) {
              return sub.orWhere(
                `application.school_year_id = ${item.split('-')[0]} AND application.midyear_application = 1`,
              );
            } else {
              return sub.orWhere(`application.school_year_id = ${item}`);
            }
          });
        }),
      );
    }
    if (filter && filter.specialEd && filter.specialEd.length > 0) {
      qb.andWhere('student.special_ed IN (:specialEd)', {
        specialEd: filter.specialEd,
      });
    }
    if (filter && filter.status && filter.status.length > 0) {
      qb.andWhere('application.relation_status IN (:status)', {
        status: filter.status,
      });
    }
    if (filter && filter.visibility && filter.visibility.length > 0) {
      qb.andWhere('application.hidden IN (:visibility)', {
        visibility: filter.visibility,
      });
    } else {
      qb.andWhere('application.hidden != 1');
    }
    if (filter && filter.accountStatus && filter.accountStatus.length > 0) {
      if (filter.accountStatus.length !== 2 && filter.accountStatus.includes('Verified')) {
        qb.andWhere('email_verifier.verified = :status', { status: 1 });
      }
      if (filter.accountStatus.length !== 2 && filter.accountStatus.includes('Unverified')) {
        qb.andWhere('email_verifier.verified = :status', { status: 0 });
      }
    }
    // text search
    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere('application.relation_status like :text', {
              text: `%${search}%`,
            })
            .orWhere('application.application_id like :text', {
              text: `%${search}%`,
            })
            .orWhere('person.first_name like :text', { text: `%${search}%` })
            .orWhere('person.last_name like :text', { text: `%${search}%` })
            .orWhere('p_person.first_name like :text', { text: `%${search}%` })
            .orWhere('p_person.last_name like :text', { text: `%${search}%` })
            .orWhere('application.date_submitted like :text', {
              text: `%${search}%`,
            });
        }),
      );
    }
    if (sort) {
      if (_sortBy[1].toLocaleLowerCase() === 'desc') {
        if (_sortBy[0] === 'verified') {
          qb.orderBy('email_verifier.verified', 'DESC');
        } else if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
          qb.orderBy('student_grade_level', 'DESC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`(${userEmails}).created_at`, 'DESC');
        } else if (_sortBy[0] === 'year') {
          qb.orderBy('school_year.date_begin', 'DESC');
          qb.orderBy('school_year.date_end', 'DESC');
        } else if (_sortBy[0] === 'submitted') {
          qb.orderBy('application.date_submitted', 'DESC');
        } else if (_sortBy[0] === 'sped') {
          qb.orderBy('student.special_ed', 'DESC');
        } else if (_sortBy[0] === 'student') {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'DESC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
          qb.orderBy('parent_name', 'DESC');
        } else if (_sortBy[0] === 'relation') {
          qb.orderBy('application.relation_status', 'DESC');
        } else {
          qb.orderBy('application.status', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'verified') {
          qb.orderBy('email_verifier.verified', 'ASC');
        } else if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level');
          qb.orderBy('student_grade_level', 'ASC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy(`(${userEmails}).created_at`, 'ASC');
        } else if (_sortBy[0] === 'year') {
          qb.orderBy('school_year.date_begin', 'ASC');
          qb.orderBy('school_year.date_end', 'ASC');
        } else if (_sortBy[0] === 'submitted') {
          qb.orderBy('application.date_submitted', 'ASC');
        } else if (_sortBy[0] === 'sped') {
          qb.orderBy('student.special_ed', 'ASC');
        } else if (_sortBy[0] === 'student') {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'ASC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
          qb.orderBy('parent_name', 'ASC');
        } else if (_sortBy[0] === 'relation') {
          qb.orderBy('application.relation_status', 'ASC');
        } else {
          qb.orderBy('application.status', 'ASC');
        }
      }
    }
    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<Application>({
      results,
      total,
    });
  }

  findOneById(application_id: number): Promise<Application> {
    return this.applicationsRepository.findOne(application_id);
  }

  async findByStudent(student_id: number): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: {
        student_id: student_id,
      },
    });
  }

  async create(application: CreateStudentApplicationInput): Promise<Application> {
    return this.applicationsRepository.save({
      ...application,
      status: 'Submitted',
      date_started: new Date(),
      date_submitted: new Date(),
    });
  }

  async delete(application_id: number): Promise<Application> {
    const application = await this.findOneById(application_id);
    await this.applicationsRepository.delete(application_id);
    return application;
  }

  async acceptApplication(acceptApplicationInput: AcceptApplicationInput): Promise<Application[]> {
    const { application_ids } = acceptApplicationInput;

    const promise = Promise.all(
      application_ids.map(async (id) => {
        const application_id = Number(id);

        await this.applicationsRepository.save({
          application_id,
          status: 'Accepted',
          date_accepted: new Date(),
        });

        const application = await this.applicationsRepository.findOne(application_id);
        const { student_id } = application;

        const existingPacket = await this.packetsService.findOneByStudentId(student_id);
        const existingPerson = await this.studentService.findOneById(student_id);
        const {
          parent: { person_id },
        } = existingPerson;

        const existingPersonAddress = await this.personAddressService.findOneById(person_id);

        let existingSchoolDistrict = '';
        if (existingPersonAddress) {
          const { address_id } = existingPersonAddress;

          const existingAddress = await this.addressService.findOneById(address_id);
          existingSchoolDistrict = existingAddress.school_district;
        }

        const packet_id = existingPacket && existingPacket.packet_id;
        // const deadline = new Date();
        const student = await this.studentService.findOneById(student_id);

        const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(
          student.parent?.person?.user_id,
        );

        let region_id = 1;
        if (regions.length != 0) {
          region_id = regions[0].region_id;
        }

        const region = await this.userRegionService.userRegionByRegionId(region_id);
        const deadlineDays = region[0].regionDetail.enrollment_packet_deadline_num_days;
        const deadline = new Date().setDate(new Date().getDate() + deadlineDays);

        const UTCDeadline = new Date(deadline).toISOString();

        const default_meta = {
          meta_special_education: 0,
        };

        if (student.special_ed != 0) {
          default_meta['meta_special_education'] = student.special_ed;
        }

        // const UTCdeadline = new Date(UTCDate.year(), UTCDate.month(), UTCDate.date(), UTCDate.hour(), UTCDate.minute(), UTCDate.second(), UTCDate.millisecond())
        const parseGradeLevel = (value: number | string): number => {
          if (!value) return 0;
          if (value === 'OR-K') return 0;
          if (['K', 'Kindergarten', 'Kin'].indexOf(value + '') !== -1) return 5;
          return Number(value) + 5;
        };
        const age = student.person.date_of_birth ? Moment().diff(student.person.date_of_birth, 'years', false) : 0;
        const grade_age = student.grade_levels.length > 0 ? parseGradeLevel(student.grade_levels[0].grade_level) : 0;
        let is_age_issue = false;

        if (student.person.date_of_birth && grade_age != 0) {
          is_age_issue = age < grade_age;
        }

        const studentPacket = await this.packetsService.createOrUpdate({
          packet_id,
          student_id,
          status: 'Not Started',
          deadline: UTCDeadline,
          date_accepted: null,
          date_submitted: null,
          date_last_submitted: null,
          is_age_issue: is_age_issue,
          secondary_contact_first: application?.secondary_contact_first,
          secondary_contact_last: application?.secondary_contact_last,
          school_district: existingSchoolDistrict,
          meta: JSON.stringify(default_meta),
        });

        const statudUpdated = this.studentStatusService.update({
          student_id: student_id,
          school_year_id: application.school_year_id,
          status: 6,
        });

        const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
          EmailTemplateEnum.APPLICATION_ACCEPTED,
          region_id,
        );

        const school_year = await this.schoolYearService.findOneById(application.school_year_id);

        if (!school_year.enrollment_packet) {
          await this.studentRecordService.createStudentRecord(student.student_id, school_year.RegionId, 6, null);
        }

        if (emailTemplate) {
          const setAdditionalLinksInfo = (content, student, school_year) => {
            const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
            const yearend = new Date(school_year.date_end).getFullYear().toString();
            const yearText = application.midyear_application
              ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
              : `${yearbegin}-${yearend.substring(2, 4)}`;

            return content
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[APPLICATION_YEAR\]/g, yearText)
              .replace(/\[DEADLINE\]/g, `${Moment.utc(UTCDeadline).format('MM/DD/yy')}`);
          };
          const body = setAdditionalLinksInfo(emailTemplate.body, student, school_year);
          const emailSubject = setAdditionalLinksInfo(emailTemplate.subject, student, school_year);

          await this.sesEmailService.sendEmail({
            email: student.parent?.person?.email,
            subject: emailSubject,
            content: body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
            region_id: region_id,
            template_name: 'Application Accepted',
          });
        }
        return application;
      }),
    );
    return promise;
  }

  async findByIds(application_ids: string[]): Promise<Application[]> {
    const applications = await this.applicationsRepository.findByIds(application_ids);
    return applications;
  }

  async sendEmail(emailApplicationInput: EmailApplicationInput): Promise<ApplicationEmail[]> {
    const { application_ids, subject, body } = emailApplicationInput;
    const [results, total] = await this.applicationsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.student', 'student')
      .leftJoinAndSelect('application.school_year', 'school_year')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .whereInIds(application_ids)
      .getManyAndCount();

    const user_id = results[0].student.parent.person.user_id;
    const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(user_id);

    let region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate = await this.emailTemplateService.findByTemplateAndRegion(
      EmailTemplateEnum.APPLICATION_PAGE,
      region_id,
    );
    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(emailTemplate.id, emailTemplate.from, subject, body);
    }

    const setEmailBodyInfo = (student, school_year, application) => {
      const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      const yearText = application.midyear_application
        ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
        : `${yearbegin}-${yearend.substring(2, 4)}`;

      return emailTemplate.body
        .toString()
        .replace(/\[STUDENT\]/g, student.person?.first_name)
        .replace(/\[PARENT\]/g, student.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[APPLICATION_YEAR\]/g, yearText);
    };

    const setEmailSubjectInfo = (student, school_year, application) => {
      const yearbegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      const yearText = application.midyear_application
        ? `${yearbegin}-${yearend.substring(2, 4)} Mid-year`
        : `${yearbegin}-${yearend.substring(2, 4)}`;

      return emailTemplate.subject
        .toString()
        .replace(/\[STUDENT\]/g, student.person?.first_name)
        .replace(/\[PARENT\]/g, student.parent?.person?.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[APPLICATION_YEAR\]/g, yearText);
    };

    for (let index = 0; index < results.length; index++) {
      const item = results[index];
      // const gradeLevels = await this.studentGradeLevelsService.forStudents(item.student.student_id);
      // const school_year = await this.schoolYearService.findOneById(gradeLevels[0].school_year_id);
      const emailBody = setEmailBodyInfo(item.student, item.school_year, item);
      const emailSubject = setEmailSubjectInfo(item.student, item.school_year, item);

      const result = await this.sesEmailService.sendEmail({
        email: item.student.parent.person.email,
        subject: emailSubject,
        content: emailBody,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
        region_id,
        template_name: EmailTemplateEnum.APPLICATION_PAGE,
      });
    }

    const applicationEmails = Promise.all(
      application_ids.map(async (id) => {
        return await this.applicationEmailsService.create({
          application_id: id,
          subject: subject,
          body: body,
          from_email: emailTemplate.from,
        });
      }),
    );
    return applicationEmails;
  }

  async moveThisYearApplication(deleteApplicationInput: DeleteApplicationInput): Promise<boolean> {
    const { application_ids } = deleteApplicationInput;
    const thisSchoolYear = await this.schoolYearService.findThisYear();
    const result = await this.applicationsRepository.update(application_ids, {
      school_year_id: thisSchoolYear.school_year_id,
    });
    return true;
  }

  async moveNextYearApplication(deleteApplicationInput: DeleteApplicationInput): Promise<boolean> {
    const { application_ids } = deleteApplicationInput;
    const thisSchoolYear = await this.schoolYearService.findNextYear();
    const result = await this.applicationsRepository.update(application_ids, {
      school_year_id: thisSchoolYear.school_year_id,
    });
    return true;
  }

  async getAllSchoolYear(): Promise<SchoolYear[]> {
    return this.schoolYearService.findAll();
  }

  async updateApplication(updateApplicationInput: UpdateApplicationInput): Promise<Application> {
    const { application_id, midyear_application, status, school_year_id, relation_status } = updateApplicationInput;

    if (status == 'Accepted') {
      const application_ids = [];
      application_ids.push(application_id);
      const acceptApplicationInput = {
        application_ids,
        midyear_application,
      };
      const acceptApplication = await this.acceptApplication(acceptApplicationInput);
    }

    if (status == 'Submitted' && relation_status == 2) {
      const application = await this.applicationsRepository.save({
        application_id,
        midyear_application,
        status: status,
        school_year_id,
        relation_status,
        date_started: new Date(),
        date_submitted: new Date(),
      });
      return application;
    }

    const application = await this.applicationsRepository.save({
      application_id,
      midyear_application,
      status: status,
      school_year_id,
      relation_status,
    });
    return application;
  }

  async toggleHideApplication(updateApplicationInput: UpdateApplicationInput): Promise<Application> {
    const { application_id, midyear_application } = updateApplicationInput;
    const application = await this.applicationsRepository.save({
      application_id,
      hidden: midyear_application,
    });
    return application;
  }

  async updateApplicationSchoolYearByIds(updateApplicationSchoolYearInput: UpdateSchoolYearIdsInput): Promise<boolean> {
    const { application_ids, school_year_id, midyear_application } = updateApplicationSchoolYearInput;
    Promise.all(
      application_ids.map(async (id) => {
        const application_id = Number(id);
        await this.applicationsRepository.update(
          { application_id },
          {
            school_year_id,
            midyear_application: midyear_application == 1 ? true : false,
          },
        );
      }),
    );
    return true;
  }

  async findBySchoolYearAndStudent({ student_id, school_year_id }): Promise<Application> {
    const applications = await this.applicationsRepository.findOne({
      where: {
        student_id,
        school_year_id,
      },
    });
    return applications;
  }
}
