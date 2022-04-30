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
import { ApplicationEmail } from '../models/application-email.entity';
import { SchoolYearService } from './schoolyear.service';
import { SchoolYear } from '../models/schoolyear.entity';
import { UpdateApplicationInput } from '../dto/update-application.inputs';
import { EmailTemplatesService } from './email-templates.service';
import { StudentsService } from './students.service';
import { ResponseDTO } from '../dto/response.dto';
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private packetsService: PacketsService,
    private sesEmailService: EmailsService,
    private applicationEmailsService: ApplicationEmailsService,
    private schoolYearService: SchoolYearService,
    private emailTemplateService: EmailTemplatesService,
    private studentService: StudentsService,
  ) {}

  async getSubmittedApplicationCount(regionId: number): Promise<ResponseDTO> {
    const queryRunner = await getConnection().createQueryRunner();
    const result = await queryRunner.query(
      `SELECT
          COUNT(*) AS count
        FROM (
          SELECT 
            *
            FROM infocenter.mth_application
            WHERE status = 'Submitted'
        ) AS application
        LEFT JOIN infocenter.mth_schoolyear AS schoolYear ON (schoolYear.school_year_id=application.school_year_id)
        WHERE schoolYear.RegionId = ${regionId}`,
    );
    queryRunner.release();
    const statusArray = {
      'Not Started': 0,
      'Missing Info': 0,
      Submitted: 0,
      Resubmitted: 0,
      'Age Issue': 0,
      Conditional: 0,
      Accepted: 0,
    };
    result.map((item) => {
      statusArray.Submitted = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async findAll(
    applicationsArgs: ApplicationsArgs,
  ): Promise<Pagination<Application>> {
    const { skip, take, sort, filter, search } = applicationsArgs;
    const _sortBy = sort.split('|');
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
      .where('application.status = "Submitted"');
    if (
      filter &&
      filter.grades &&
      filter.grades.length > 0
      // &&
      // !filter.grades.includes('all')
    ) {
      let grades = [];
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
          if (item === 'Kindergarten') {
            grades.push('K');
          }
        });
      // qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: grades });
      qb.andWhere('grade_levels.grade_level IN (:grades)', { grades: grades });
    }
    if (filter && filter.schoolYear && filter.schoolYear.length > 0) {
      let years = [];
      filter.schoolYear.map((item) => {
        if (!years.includes(item.split('-')[0])) {
          years.push(item.split('-')[0]);
        }
        if (!years.includes(item.split('-')[1])) {
          years.push(item.split('-')[1]);
        }
      });
      years.sort();
      const startDate = new Date(years[0], 1, 1);
      const endDate = new Date(years[years.length - 1], 1, 1);
      qb.andWhere('school_year.date_begin BETWEEN :startDate AND :endDate', {
        startDate: startDate,
        endDate: endDate,
      });
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
      if (
        filter.accountStatus.length !== 2 &&
        filter.accountStatus.includes('Verified')
      ) {
        qb.andWhere('email_verifier.verified = :status', { status: 1 });
      }
      if (
        filter.accountStatus.length !== 2 &&
        filter.accountStatus.includes('Unverified')
      ) {
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
          qb.addSelect(
            'ABS(grade_levels.grade_level + 0)',
            'student_grade_level',
          );
          qb.orderBy('student_grade_level', 'DESC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy('application_emails.created_at', 'DESC');
        } else if (_sortBy[0] === 'year') {
          qb.orderBy('school_year.date_begin', 'DESC');
          qb.orderBy('school_year.date_end', 'DESC');
        } else if (_sortBy[0] === 'submitted') {
          qb.orderBy('application.date_submitted', 'DESC');
        } else if (_sortBy[0] === 'sped') {
          qb.orderBy('student.special_ed', 'DESC');
        } else if (_sortBy[0] === 'student') {
          qb.orderBy('person.last_name', 'DESC');
        } else if (_sortBy[0] === 'parent') {
          qb.orderBy('p_person.last_name', 'DESC');
        } else if (_sortBy[0] === 'relation') {
          qb.orderBy('application.relation_status', 'DESC');
        } else {
          qb.orderBy('application.status', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'verified') {
          qb.orderBy('email_verifier.verified', 'ASC');
        } else if (_sortBy[0] === 'grade') {
          qb.addSelect(
            'ABS(grade_levels.grade_level + 0)',
            'student_grade_level',
          );
          qb.orderBy('student_grade_level', 'ASC');
        } else if (_sortBy[0] === 'emailed') {
          qb.orderBy('application_emails.created_at', 'ASC');
        } else if (_sortBy[0] === 'year') {
          qb.orderBy('school_year.date_begin', 'ASC');
          qb.orderBy('school_year.date_end', 'ASC');
        } else if (_sortBy[0] === 'submitted') {
          qb.orderBy('application.date_submitted', 'ASC');
        } else if (_sortBy[0] === 'sped') {
          qb.orderBy('student.special_ed', 'ASC');
        } else if (_sortBy[0] === 'student') {
          qb.orderBy('person.last_name', 'ASC');
        } else if (_sortBy[0] === 'parent') {
          qb.orderBy('p_person.last_name', 'ASC');
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

  async create(
    application: CreateStudentApplicationInput,
  ): Promise<Application> {
    return this.applicationsRepository.save({
      ...application,
      status: 'Submitted',
      date_started: new Date(),
      date_submitted: new Date(),
    });
  }

  async acceptApplication(
    acceptApplicationInput: AcceptApplicationInput,
  ): Promise<Application[]> {
    const { application_ids, midyear_application } = acceptApplicationInput;
    const emailTemplate = await this.emailTemplateService.findByTemplate(
      'Application Accepted',
    );
    const promise = Promise.all(
      application_ids.map(async (id) => {
        const application_id = Number(id);
        await this.applicationsRepository.save({
          application_id,
          status: 'Accepted',
          date_accepted: new Date(),
          midyear_application: midyear_application,
        });

        const application = await this.applicationsRepository.findOne(
          application_id,
        );
        const { student_id } = application;

        const existingPacket = await this.packetsService.findOneByStudentId(
          student_id,
        );
        const packet_id = existingPacket && existingPacket.packet_id;

        const studentPacket = await this.packetsService.createOrUpdate({
          packet_id,
          student_id,
          status: 'Not Started',
          deadline: new Date(),
          date_accepted: null,
          date_submitted: null,
          date_last_submitted: null,
          is_age_issue: false,
        });

        const student = await this.studentService.findOneById(student_id);
        if (emailTemplate) {
          await this.sesEmailService.sendEmail({
            email: student.parent?.person?.email,
            subject: emailTemplate.subject,
            content: emailTemplate.body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
          });
        }
        return application;
      }),
    );
    return promise;
  }

  async deleteApplication(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Application[]> {
    const { application_ids } = deleteApplicationInput;
    const applications = await this.applicationsRepository.findByIds(
      application_ids,
    );
    const result = await this.applicationsRepository.delete(application_ids);
    return applications;
  }

  async sendEmail(
    emailApplicationInput: EmailApplicationInput,
  ): Promise<ApplicationEmail[]> {
    const { application_ids, subject, body } = emailApplicationInput;
    const [results, total] = await this.applicationsRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.student', 'student')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'person')
      .whereInIds(application_ids)
      .getManyAndCount();
    const emailTemplate = await this.emailTemplateService.findByTemplate(
      'Application Page',
    );
    if (emailTemplate) {
      await this.emailTemplateService.updateEmailTemplate(
        emailTemplate.id,
        subject,
        body,
      );
    }
    const emails = results.map((item) => item.student.parent.person.email);
    emails.forEach(async (email) => {
      const result = await this.sesEmailService.sendEmail({
        email,
        subject,
        content: body,
        from: emailTemplate.from,
        bcc: emailTemplate.bcc,
      });
    });
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

  async moveThisYearApplication(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
    const { application_ids } = deleteApplicationInput;
    const thisSchoolYear = await this.schoolYearService.findThisYear();
    const result = await this.applicationsRepository.update(application_ids, {
      school_year_id: thisSchoolYear.school_year_id,
    });
    return true;
  }

  async moveNextYearApplication(
    deleteApplicationInput: DeleteApplicationInput,
  ): Promise<Boolean> {
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

  async updateApplication(
    updateApplicationInput: UpdateApplicationInput,
  ): Promise<Application> {
    const { application_id, midyear_application, status, school_year_id } =
      updateApplicationInput;
    const application = await this.applicationsRepository.save({
      application_id,
      midyear_application,
      status: status,
      school_year_id,
    });
    return application;
  }

  async toggleHideApplication(
    updateApplicationInput: UpdateApplicationInput,
  ): Promise<Application> {
    const { application_id, midyear_application } = updateApplicationInput;
    const application = await this.applicationsRepository.save({
      application_id,
      hidden: midyear_application,
    });
    return application;
  }
}
