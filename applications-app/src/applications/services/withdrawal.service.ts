import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Moment from 'moment';
import { Pagination } from 'src/paginate';
import { Repository, getConnection } from 'typeorm';
import { EmailWithdrawalInput } from '../dto/email-withdrawal.inputs';
import { FilterInput } from '../dto/filter.input';
import { IndividualWithdrawalInput } from '../dto/individual-withdrawal.inputs';
import { PaginationInput } from '../dto/pagination.input';
import { QuickWithdrawalInput } from '../dto/quick-withdrawal.inputs';
import { ReinstateWithdrawalInput } from '../dto/reinstate-withdrawal.inputs';
import { ResponseDTO } from '../dto/response.dto';
import { WithdrawalStudentInfo } from '../dto/student-info-by-withdrawalId.dto';
import { UpdateWithdrawalInput } from '../dto/withdrawal-update.inputs.';
import { UserRegion } from '../models/user-region.entity';
import { WithdrawalEmail } from '../models/withdrawal-email.entity';
import { Withdrawal, WITHDRAWAL_TABLE_NAME } from '../models/withdrawal.entity';
import { EmailReminderService } from './email-reminder.service';
import { EmailTemplatesService } from './email-templates.service';
import { EmailsService } from './emails.service';
import { SchoolYearService } from './schoolyear.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { StudentsService } from './students.service';
import { UserRegionService } from './user-region.service';
import { WithdrawalEmailsService } from './withdrawal-emails.service';
import {
  PdfTemplate,
  StudentRecordFileKind,
  WithdrawalStatus,
  WithdrawalOption,
  StudentStatusEnum,
  EmailTemplateEnum,
} from '../enums';
import { WithdrawalInput } from '../dto/withdrawal.input';
import { FilesService } from './files.service';
import { StudentRecordService } from './student-record.service';
import { S3DirectoryStudentRecords } from '../utils';
import { gradeText } from '../utils';
import { PDFService } from './pdf.service';
@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly repo: Repository<Withdrawal>,
    private emailReminderService: EmailReminderService,
    private emailService: EmailsService,
    private studentService: StudentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private schoolYearService: SchoolYearService,
    private withdrawalEmailService: WithdrawalEmailsService,
    private filesService: FilesService,
    private studentRecordService: StudentRecordService,
    private pdfService: PDFService,
  ) {}

  async save(withdrawalInput: WithdrawalInput): Promise<boolean> {
    try {
      const { withdrawal, withdrawalOption } = withdrawalInput;
      const queryRunner = await getConnection().createQueryRunner();
      const { StudentId, status, date_effective, response, withdrawal_id, school_year_id } = withdrawal;

      const [notifiedWithdrawals] = await this.repo
        .createQueryBuilder('withdrawal')
        .where({ StudentId: StudentId, status: WithdrawalStatus.NOTIFIED })
        .getManyAndCount();

      const existingWithdrawalId = notifiedWithdrawals?.length ? notifiedWithdrawals[0].withdrawal_id : 0;
      const withdrawalResponse = await this.repo.save({
        withdrawal_id: withdrawal_id || existingWithdrawalId,
        StudentId: StudentId,
        status: status,
        date_effective: date_effective,
        response: response,
        school_year_id: school_year_id,
      });
      if (
        (status === WithdrawalStatus.WITHDRAWN && notifiedWithdrawals?.length) ||
        withdrawalOption === WithdrawalOption.UNDECLARED_FORM_EMAIL ||
        withdrawalOption === WithdrawalOption.UNDECLARED_FORM_NO_EMAIL
      ) {
        // 1. Admin sent withdraw notification and parent submitted withdraw form
        // 2. When admin withdraw
        const isPdfGenerated = await this.generateWithdrawalFormPdf(withdrawalResponse.withdrawal_id);
        if (!isPdfGenerated) return false;
      }

      if (
        (status == WithdrawalStatus.NOTIFIED && !notifiedWithdrawals?.length) ||
        (status == WithdrawalStatus.WITHDRAWN && withdrawalOption === WithdrawalOption.UNDECLARED_FORM_EMAIL)
      ) {
        // Notify withdrawal flow by admin
        withdrawal.date_emailed = new Date();

        //	Send email
        const webAppUrl = process.env.WEB_APP_URL;
        const student = await this.studentService.findOneById(StudentId);
        const cur_application = student.applications[0];

        const regions: UserRegion[] = await this.userRegionService.findUserRegionByUserId(
          student.parent?.person?.user_id,
        );

        let region_id = 1;
        if (regions.length > 0) {
          region_id = regions[0].region_id;
        }

        const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
          withdrawalOption == WithdrawalOption.NOTIFY_PARENT_OF_WITHDRAW
            ? EmailTemplateEnum.NOTIFY_OF_WITHDRAW
            : EmailTemplateEnum.UNDECLARED_WITHDRAW,
          school_year_id,
          cur_application.midyear_application,
        );

        const deadline = new Date();
        let remind_date = 0;
        const deadlineInfo = await queryRunner.query(
          `SELECT withdraw_deadline_num_days AS deadline FROM infocenter.region WHERE id = ${region_id}`,
        );
        deadlineInfo.map((item) => {
          deadline.setDate(deadline.getDate() + item.deadline);
          remind_date = item.deadline;
        });

        if (emailTemplate) {
          const setAdditionalLinksInfo = (content, student, school_year) => {
            const yearBegin = new Date(school_year.date_begin).getFullYear().toString();
            const yearEnd = new Date(school_year.date_end).getFullYear().toString();
            const yearText = cur_application.midyear_application
              ? `${yearBegin}-${yearEnd.substring(2, 4)} Mid-year`
              : `${yearBegin}-${yearEnd.substring(2, 4)}`;

            const link = `${webAppUrl}/parent-link/withdrawal/${StudentId}`;

            return content
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, yearText)
              .replace(/\[LINK\]/g, `<a href='${link}'>${link}</a>`)
              .replace(/\[DEADLINE\]/g, `${Moment(deadline).format('MM/DD/yy')}`);
          };

          const school_year = await this.schoolYearService.findOneById(school_year_id);

          const body = setAdditionalLinksInfo(emailTemplate.body, student, school_year);
          const emailSubject = setAdditionalLinksInfo(emailTemplate.subject, student, school_year);

          await this.emailService.sendEmail({
            email: student.parent?.person?.email,
            subject: emailSubject,
            content: body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
            region_id: region_id,
            template_name:
              withdrawalOption == WithdrawalOption.NOTIFY_PARENT_OF_WITHDRAW
                ? EmailTemplateEnum.NOTIFY_OF_WITHDRAW
                : EmailTemplateEnum.UNDECLARED_WITHDRAW,
          });

          if (withdrawalResponse?.withdrawal_id) {
            await this.withdrawalEmailService.create({
              withdrawal_id: withdrawalResponse?.withdrawal_id,
              subject: emailSubject,
              body: body,
              from_email: emailTemplate.from,
              created_at: new Date(),
            });
            await queryRunner.query(
              `UPDATE infocenter.withdrawal SET date_emailed = NOW() WHERE withdrawal_id=${withdrawalResponse.withdrawal_id}`,
            );
          }

          await this.runScheduleReminders(remind_date);
        }
      }
      await queryRunner.release();
      return true;
    } catch (error) {
      throw new ServiceUnavailableException(error, `${withdrawalInput}`);
    }
  }

  async delete(student_id: number, active_option: number): Promise<boolean> {
    //active_option 1: Delete Withdraw Form from Records 2: Keep Withdraw Form
    try {
      const queryRunner = await getConnection().createQueryRunner();
      await queryRunner.query(`DELETE FROM infocenter.withdrawal WHERE StudentId=${student_id}`);
      if (active_option == 1) {
        await queryRunner.query(
          `DELETE FROM infocenter.mth_student_record_file WHERE RecordId IN (SELECT record_id FROM infocenter.mth_student_record WHERE StudentId = ${student_id}) AND file_kind = '${StudentRecordFileKind.WITHDRAWAL_FORM}';`,
        );
      }
      await queryRunner.release();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStatus(filterInput: FilterInput): Promise<ResponseDTO> {
    const { filter } = filterInput;
    const values = [];

    let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			WHERE ${WITHDRAWAL_TABLE_NAME}.withdrawal_id > 0`;

    if (filter.StudentId) {
      main_query += ` AND ${WITHDRAWAL_TABLE_NAME}.StudentId = ${filter.StudentId}`;
    }

    //	Get total count
    const query = `SELECT ${WITHDRAWAL_TABLE_NAME}.status ${main_query} ORDER BY date DESC LIMIT 0, 1`;
    const qb = await this.repo.query(query);
    qb.map((item) => {
      values.push(item);
    });

    return <ResponseDTO>{
      error: false,
      results: values,
    };
  }

  async getCountsByStatus(filterInput: FilterInput): Promise<ResponseDTO> {
    const { filter } = filterInput;
    const values = {};

    let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			LEFT JOIN mth_application application ON (application.student_id = ${WITHDRAWAL_TABLE_NAME}.StudentId)
			LEFT JOIN mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
			LEFT JOIN mth_student student ON (student.student_id = application.student_id)
			LEFT JOIN mth_person person ON (person.person_id = student.person_id)
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = ${WITHDRAWAL_TABLE_NAME}.school_year_id)
			WHERE ${WITHDRAWAL_TABLE_NAME}.withdrawal_id > 0`;

    if (filter.region_id) {
      main_query += ` AND schoolYear.RegionId = ${filter.region_id}`;
    }
    if (filter.selectedYear) {
      main_query += ` AND schoolYear.school_year_id = ${filter.selectedYear}`;
    }
    if (filter.status && filter.status.length > 0) {
      main_query += ' AND withdrawal.status IN (""';
      filter.status.forEach((status) => {
        main_query += ', "' + status + '"';
      });
      main_query += ')';
    }
    if (filter.keyword && filter.keyword.trim() != '') {
      //	submitted, effective, student, soe, emailed
      //	TODO : grade, funding
      const key: string = filter.keyword.trim();
      main_query += ` AND (
					date LIKE "%${key}%"
					OR date_effective LIKE "%${key}%"
					OR CONCAT(person.last_name, ", ", person.first_name) LIKE "%${key}%"
					OR soe LIKE "%${key}%"
					OR date_emailed LIKE "%${key}%")`;
    }

    //	Get total count
    const query = `SELECT ${WITHDRAWAL_TABLE_NAME}.status, COUNT(*) cnt ${main_query} GROUP BY status ORDER BY status`;
    const qb = await this.repo.query(query);
    qb.map((item) => {
      values[item.status] = +item.cnt;
    });

    return <ResponseDTO>{
      error: false,
      results: values,
    };
  }

  async find(paginationInput: PaginationInput, filterInput: FilterInput): Promise<Pagination<Withdrawal>> {
    const { skip, take, sort } = paginationInput;
    const { filter } = filterInput;

    const select_query = `SELECT ${WITHDRAWAL_TABLE_NAME}.withdrawal_id, ${WITHDRAWAL_TABLE_NAME}.status, ${WITHDRAWAL_TABLE_NAME}.soe, ${WITHDRAWAL_TABLE_NAME}.funding, 
    ${WITHDRAWAL_TABLE_NAME}.date_effective, ${WITHDRAWAL_TABLE_NAME}.response,${WITHDRAWAL_TABLE_NAME}.date,
		CONCAT(person.last_name, ", ", person.first_name) student_name,
		gradeLevel.grade_level, emails.email_date AS date_emailed, student.student_id AS StudentId`;

    let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			LEFT JOIN mth_application application ON (application.student_id = ${WITHDRAWAL_TABLE_NAME}.StudentId)
			LEFT JOIN mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = ${WITHDRAWAL_TABLE_NAME}.school_year_id)
			LEFT JOIN mth_student student ON (student.student_id = application.student_id)
			LEFT JOIN mth_person person ON (person.person_id = student.person_id) 
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = ${WITHDRAWAL_TABLE_NAME}.school_year_id)
      LEFT JOIN (
        SELECT  withdrawal_id, MAX(created_at) email_date
        FROM    mth_withdrawal_email
        GROUP BY withdrawal_id
      ) emails ON emails.withdrawal_id = ${WITHDRAWAL_TABLE_NAME}.withdrawal_id
			WHERE ${WITHDRAWAL_TABLE_NAME}.withdrawal_id > 0`;

    if (filter.region_id) {
      main_query += ` AND schoolYear.RegionId = ${filter.region_id}`;
    }
    if (filter.selectedYear) {
      main_query += ` AND schoolYear.school_year_id = ${filter.selectedYear}`;
    }
    if (filter.status && filter.status.length > 0) {
      main_query += ' AND withdrawal.status IN (""';
      filter.status.forEach((status) => {
        main_query += ', "' + status + '"';
      });
      main_query += ')';
    } else {
      main_query += ' AND withdrawal.status IN ("empty")';
    }

    if (filter.keyword && filter.keyword.trim() != '') {
      //	submitted, effective, student, soe, emailed
      //	TODO : grade, funding
      const key: string = filter.keyword.trim();
      main_query += ` AND (
					date LIKE "%${key}%"
					OR date_effective LIKE "%${key}%"
					OR CONCAT(person.last_name, ", ", person.first_name) LIKE "%${key}%"
					OR soe LIKE "%${key}%"
					OR date_emailed LIKE "%${key}%")`;
    }

    //	Get total count
    const queryRunner = await getConnection().createQueryRunner();
    const res = await queryRunner.query(`SELECT COUNT(*) cnt ${main_query}`);

    //	Order
    switch (sort.split('|')[0]) {
      case 'submitted':
        main_query += ` ORDER BY date ${sort.split('|')[1]}`;
        break;
      case 'status':
        main_query += ` ORDER BY status ${sort.split('|')[1]}`;
        break;
      case 'effective':
        main_query += ` ORDER BY date_effective ${sort.split('|')[1]}`;
        break;
      case 'student':
        main_query += ` ORDER BY student_name ${sort.split('|')[1]}`;
        break;
      case 'grade':
        main_query += ` ORDER BY gradeLevel.grade_level+0 ${sort.split('|')[1]}`;
        break;
      case 'soe':
        main_query += ` ORDER BY soe ${sort.split('|')[1]}`;
        break;
      case 'funding':
        main_query += ` ORDER BY funding ${sort.split('|')[1]}`;
        break;
      case 'emailed':
        main_query += ` ORDER BY date_emailed ${sort.split('|')[1]}`;
        break;
      default:
        break;
    }
    //	Pagination
    main_query += ` LIMIT ${skip}, ${take}`;
    const results = await queryRunner.query(`${select_query}${main_query}`);
    await queryRunner.release();

    return new Pagination<Withdrawal>({
      results,
      total: res[0].cnt,
    });
  }

  async runScheduleReminders(remind_date = 0): Promise<string> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const webAppUrl = process.env.WEB_APP_URL;
      // Automatically make a student as "Undeclared" when parent does not submit withdraw form by deadline and send parents an email notification
      const withdrawals = await queryRunner.query(`
        SELECT
          withdrawal.withdrawal_id AS withdrawal_id,
          person.email AS parent_email,
          templates.bcc AS email_bcc,
          templates.from AS email_from,
          templates.body AS email_body,
          templates.subject AS email_subject,
          studentInfo.first_name AS student_name,
          person.first_name AS parent_name,
          schoolYear.date_begin AS date_begin,
          schoolYear.date_end AS date_end
        FROM (
          SELECT withdrawal_id, StudentId AS student_id, datediff(now(), date) AS diff_date, school_year_id FROM infocenter.withdrawal WHERE status='${WithdrawalStatus.NOTIFIED}' and StudentId IS NOT NULL
        ) AS withdrawal
        LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawal.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = withdrawal.school_year_id)
        LEFT JOIN infocenter.region region ON (region.id = schoolYear.RegionId)
        LEFT JOIN infocenter.mth_student student ON (student.student_id = withdrawal.student_id)
        LEFT JOIN infocenter.mth_person studentInfo ON (studentInfo.person_id = student.person_id)
        LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
        LEFT JOIN infocenter.email_templates templates ON (templates.template_name = '${EmailTemplateEnum.UNDECLARED_WITHDRAW}' AND templates.region_id = schoolYear.RegionId)
        WHERE 
          region.withdraw_deadline_num_days < withdrawal.diff_date AND 
          templates.id IS NOT NULL
      `);

      // To send reminder email to parent by deadline
      const reminders = await queryRunner.query(`
				SELECT
					withdrawal.*,
					region.withdraw_deadline_num_days - withdrawal.diff_date AS remain_date,
					region.id AS region_id,
          application.midyear_application as midyear_application,
					person.email AS parent_email,
					templates.id AS email_templates_id,
					templates.bcc AS email_bcc,
					templates.from AS email_from,
          studentInfo.first_name AS student_name,
          person.first_name AS parent_name,
          schoolYear.date_begin AS date_begin,
          schoolYear.date_end AS date_end
				FROM (
					SELECT StudentId AS student_id, datediff(now(), date) AS diff_date, school_year_id FROM infocenter.withdrawal WHERE status='${
            WithdrawalStatus.NOTIFIED
          }' and StudentId IS NOT NULL
				) AS withdrawal
				LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawal.student_id)
				LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = withdrawal.school_year_id)
				LEFT JOIN infocenter.region region ON (region.id = schoolYear.RegionId)
				LEFT JOIN infocenter.mth_student student ON (student.student_id = withdrawal.student_id)
        LEFT JOIN infocenter.mth_person studentInfo ON (studentInfo.person_id = student.person_id)
				LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
				LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
				LEFT JOIN infocenter.email_templates templates ON (templates.template_name = '${
          EmailTemplateEnum.NOTIFY_OF_WITHDRAW
        }' AND templates.region_id = schoolYear.RegionId)
				WHERE 
					${
            remind_date > 0
              ? 'withdrawal.diff_date = 0'
              : 'region.withdraw_deadline_num_days > withdrawal.diff_date AND withdrawal.diff_date > 0'
          } AND 
					templates.id IS NOT NULL
			`);
      await queryRunner.release();

      reminders.map(async (reminder) => {
        const {
          remain_date,
          parent_email,
          email_templates_id,
          email_bcc,
          email_from,
          student_name,
          parent_name,
          date_begin,
          date_end,
          midyear_application,
          student_id,
        } = reminder;
        const yearBegin = new Date(date_begin).getFullYear().toString();
        const yearEnd = new Date(date_end).getFullYear().toString();

        const link = `${webAppUrl}/parent-link/withdrawal/${student_id}`;

        const yearText = midyear_application
          ? `${yearBegin}-${yearEnd.substring(2, 4)} Mid-year`
          : `${yearBegin}-${yearEnd.substring(2, 4)}`;

        const emailReminders = await this.emailReminderService.findByTemplateIdAndReminder(
          email_templates_id,
          Number(remain_date),
        );
        emailReminders.map(async (emailReminder) => {
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + Number(remain_date));

          await this.emailService.sendEmail({
            email: parent_email,
            subject: emailReminder.subject
              .toString()
              .replace(/\[STUDENT\]/g, student_name)
              .replace(/\[PARENT\]/g, parent_name)
              .replace(/\[LINK\]/g, `<a href='${link}'>${link}</a>`)
              .replace(/\[DEADLINE\]/g, `${Moment(deadline).format('MM/DD/yy')}`)
              .replace(/\[YEAR\]/g, yearText),
            content: emailReminder.body
              .toString()
              .replace(/\[STUDENT\]/g, student_name)
              .replace(/\[PARENT\]/g, parent_name)
              .replace(/\[LINK\]/g, `<a href='${link}'>${link}</a>`)
              .replace(/\[DEADLINE\]/g, `${Moment(deadline).format('MM/DD/yy')}`)
              .replace(/\[YEAR\]/g, yearText),
            bcc: email_bcc,
            from: email_from,
            template_name: 'Withdrawal Reminder',
          });
        });
      });
      withdrawals.map(async (withdrawal) => {
        const queryRunner = await getConnection().createQueryRunner();
        const {
          withdrawal_id,
          parent_email,
          email_bcc,
          email_from,
          email_body,
          email_subject,
          student_name,
          parent_name,
          date_begin,
          date_end,
        } = withdrawal;
        const yearBegin = new Date(date_begin).getFullYear().toString();
        const yearEnd = new Date(date_end).getFullYear().toString();
        await this.emailService.sendEmail({
          email: parent_email,
          subject: email_subject
            .toString()
            .replace(/\[STUDENT\]/g, student_name)
            .replace(/\[PARENT\]/g, parent_name)
            .replace(/\[YEAR\]/g, `${yearBegin}-${yearEnd.substring(2, 4)}`)
            .replace(/\[Student\]/g, student_name)
            .replace(/\[Parent\]/g, parent_name)
            .replace(/\[Year\]/g, `${yearBegin}-${yearEnd.substring(2, 4)}`),
          content: email_body
            .toString()
            .replace(/\[STUDENT\]/g, student_name)
            .replace(/\[PARENT\]/g, parent_name)
            .replace(/\[YEAR\]/g, `${yearBegin}-${yearEnd.substring(2, 4)}`)
            .replace(/\[Student\]/g, student_name)
            .replace(/\[Parent\]/g, parent_name)
            .replace(/\[Year\]/g, `${yearBegin}-${yearEnd.substring(2, 4)}`),
          from: email_from,
          bcc: email_bcc,
          template_name: EmailTemplateEnum.UNDECLARED_WITHDRAW,
        });
        await this.generateWithdrawalFormPdf(withdrawal.withdrawal_id);
        await queryRunner.query(
          `UPDATE infocenter.withdrawal SET response = 'undeclared', status='${WithdrawalStatus.WITHDRAWN}' WHERE withdrawal_id = ${withdrawal_id}`,
        );
        await queryRunner.release();
      });
      return 'Successfully run schedule reminders.';
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async sendEmail(emailWithdrawalInput: EmailWithdrawalInput): Promise<WithdrawalEmail[]> {
    const { withdrawal_ids, subject, from, body, region_id } = emailWithdrawalInput;
    const [results] = await this.repo
      .createQueryBuilder('withdrawal')
      .leftJoinAndSelect('withdrawal.Student', 'student')
      .leftJoinAndSelect('student.applications', 'applications')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('student.grade_levels', 'grade')
      .whereInIds(withdrawal_ids)
      .getManyAndCount();

    const setAdditionalLinksInfo = (content, student, school_year, cur_application) => {
      const yearBegin = new Date(school_year.date_begin).getFullYear().toString();
      const yearEnd = new Date(school_year.date_end).getFullYear().toString();
      const yearText = cur_application.midyear_application
        ? `${yearBegin}-${yearEnd.substring(2, 4)} Mid-year`
        : `${yearBegin}-${yearEnd.substring(2, 4)}`;

      return content
        .toString()
        .replace(/\[STUDENT\]/g, student.person.first_name)
        .replace(/\[PARENT\]/g, student.parent.person.first_name)
        .replace(/\[YEAR\]/g, yearText)
        .replace(/\[Student\]/g, student.person.first_name)
        .replace(/\[Parent\]/g, student.parent.person.first_name)
        .replace(/\[Year\]/g, yearText);
    };

    const emailBody = [];
    await Promise.all(
      results.map(async (item) => {
        const cur_application = item.Student.applications[0];
        const school_year = await this.schoolYearService.findOneById(cur_application.school_year_id);

        const temp = {
          withdrawal_id: item.withdrawal_id,
          email: item.Student.parent.person.email,
          body: setAdditionalLinksInfo(body, item.Student, school_year, cur_application),
          subject: setAdditionalLinksInfo(subject, item.Student, school_year, cur_application),
          school_year_id: cur_application.school_year_id,
          midYear: cur_application.midyear_application,
        };
        emailBody.push(temp);
      }),
    );

    return Promise.all(
      emailBody.map(async (emailData) => {
        const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
          EmailTemplateEnum.WITHDRAW_PAGE,
          emailData?.school_year_id,
          emailData?.midYear,
        );
        await this.emailService.sendEmail({
          email: emailData.email,
          subject: emailData.subject,
          content: emailData.body,
          from: from || emailTemplate.from,
          bcc: emailTemplate.bcc,
          region_id: region_id,
          template_name: EmailTemplateEnum.WITHDRAW_PAGE,
        });
        return await this.withdrawalEmailService.create({
          withdrawal_id: emailData.withdrawal_id,
          subject: emailData.subject,
          body: emailData.body,
          from_email: from || emailTemplate.from,
          created_at: new Date(),
        });
      }),
    );
  }

  async update(updateWithdrawalInput: UpdateWithdrawalInput): Promise<boolean> {
    try {
      const withdrawal = await this.repo.findOne(updateWithdrawalInput.withdrawal_id);
      const submittedDate = withdrawal.date;
      await this.repo.update(
        { withdrawal_id: updateWithdrawalInput.withdrawal_id },
        {
          [updateWithdrawalInput.field]: updateWithdrawalInput.value,
          date: submittedDate,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async quickWithdrawal(param: QuickWithdrawalInput): Promise<boolean> {
    try {
      const { withdrawal_ids, region_id } = param;
      const [results] = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.applications', 'applications')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .whereInIds(withdrawal_ids)
        .andWhere({ status: WithdrawalStatus.REQUESTED })
        .getManyAndCount();

      if (!results?.length) throw new ServiceUnavailableException(`Not found Withdrawal data`);

      const queryRunner = await getConnection().createQueryRunner();

      const setAdditionalLinksInfo = (content, student, school_year, cur_application) => {
        const yearBegin = new Date(school_year.date_begin).getFullYear().toString();
        const yearEnd = new Date(school_year.date_end).getFullYear().toString();
        const yearText = cur_application.midyear_application
          ? `${yearBegin}-${yearEnd.substring(2, 4)} Mid-year`
          : `${yearBegin}-${yearEnd.substring(2, 4)}`;

        return content
          .toString()
          .replace(/\[STUDENT\]/g, student.person.first_name)
          .replace(/\[PARENT\]/g, student.parent.person.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[Student\]/g, student.person.first_name)
          .replace(/\[Parent\]/g, student.parent.person.first_name)
          .replace(/\[Year\]/g, yearText);
      };

      for (let index = 0; index < results.length; index++) {
        const item = results[index];
        const withdrawalId = item.withdrawal_id;
        const cur_application = item.Student.applications[0];
        const schoolYearId = cur_application.school_year_id;
        const school_year = await this.schoolYearService.findOneById(cur_application.school_year_id);
        const studentId = item.Student.student_id;

        const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
          EmailTemplateEnum.WITHDRAW_CONFIRMATION,
          schoolYearId,
          cur_application?.midyear_application,
        );

        const isPdfGenerated = await this.generateWithdrawalFormPdf(withdrawalId);
        if (isPdfGenerated) {
          await queryRunner.query(
            `UPDATE infocenter.withdrawal SET status = '${WithdrawalStatus.WITHDRAWN}' WHERE withdrawal_id = ${withdrawalId}`,
          );
          await queryRunner.query(`
            UPDATE infocenter.mth_student_status 
            SET status = ${StudentStatusEnum.WITHDRAWN}, date_updated = NOW()
            WHERE student_id = ${studentId} AND school_year_id = ${schoolYearId}
          `);
        }

        await this.emailService.sendEmail({
          email: item.Student.parent.person.email,
          subject: setAdditionalLinksInfo(emailTemplate.subject, item.Student, school_year, cur_application),
          content: setAdditionalLinksInfo(emailTemplate.body, item.Student, school_year, cur_application),
          from: emailTemplate.from,
          bcc: emailTemplate.bcc,
          region_id: region_id,
          template_name: EmailTemplateEnum.WITHDRAW_CONFIRMATION,
        });
      }
      await queryRunner.release();

      return true;
    } catch (e) {
      throw new ServiceUnavailableException(e, `${param}`);
    }
  }

  async reinstateWithdrawal(param: ReinstateWithdrawalInput): Promise<boolean> {
    try {
      const { withdrawal_ids } = param;
      const [results] = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .whereInIds(withdrawal_ids)
        .getManyAndCount();
      results.map(async (item) => {
        const queryRunner = await getConnection().createQueryRunner();
        const withdrawal_id = item.withdrawal_id;
        const school_year_id = item.Student.grade_levels[0].school_year_id;
        const studentId = item.Student.student_id;
        await queryRunner.query(`DELETE FROM infocenter.withdrawal WHERE withdrawal_id = ${withdrawal_id}`);
        await queryRunner.query(
          `UPDATE infocenter.mth_student_status SET status = 1 WHERE student_id = ${studentId} AND school_year_id = ${school_year_id}`,
        );
        await queryRunner.release();
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async individualWithdrawal(param: IndividualWithdrawalInput): Promise<boolean> {
    try {
      const { withdrawal_id, body, type, region_id } = param;
      const withdraw = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.applications', 'applications')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .where({ withdrawal_id })
        .getOne();

      if (type === 1) {
        if (withdraw.status === WithdrawalStatus.REQUESTED) {
          const queryRunner = await getConnection().createQueryRunner();
          const withdrawalId = withdraw.withdrawal_id;
          const schoolYearId = withdraw.Student.grade_levels[0].school_year_id;
          const studentId = withdraw.Student.student_id;

          const isPdfGenerated = await this.generateWithdrawalFormPdf(withdrawalId);
          if (isPdfGenerated) {
            await queryRunner.query(
              `UPDATE infocenter.withdrawal SET status = '${WithdrawalStatus.WITHDRAWN}' WHERE withdrawal_id = ${withdrawalId};`,
            );
            await queryRunner.query(`
              UPDATE infocenter.mth_student_status 
              SET status = ${StudentStatusEnum.WITHDRAWN}, date_updated = NOW() 
              WHERE student_id = ${studentId} AND school_year_id = ${schoolYearId};
            `);
          }
          await queryRunner.release();
        }
      }

      const cur_application = withdraw.Student.applications[0];

      const setAdditionalLinksInfo = (content, student, school_year) => {
        const yearBegin = new Date(school_year.date_begin).getFullYear().toString();
        const yearEnd = new Date(school_year.date_end).getFullYear().toString();

        const yearText = cur_application.midyear_application
          ? `${yearBegin}-${yearEnd.substring(2, 4)} Mid-year`
          : `${yearBegin}-${yearEnd.substring(2, 4)}`;

        return content
          .toString()
          .replace(/\[STUDENT\]/g, student.person.first_name)
          .replace(/\[PARENT\]/g, student.parent.person.first_name)
          .replace(/\[YEAR\]/g, yearText)
          .replace(/\[Student\]/g, student.person.first_name)
          .replace(/\[Parent\]/g, student.parent.person.first_name)
          .replace(/\[Year\]/g, yearText);
      };
      const emailBody = [];
      const school_year = await this.schoolYearService.findOneById(cur_application?.school_year_id);
      const emailTemplate = await this.emailTemplateService.findByTemplateAndSchoolYearId(
        EmailTemplateEnum.WITHDRAW_PAGE,
        cur_application?.school_year_id,
        cur_application?.midyear_application,
      );
      const temp = {
        withdrawal_id: withdraw.withdrawal_id,
        email: withdraw.Student.parent.person.email,
        body: setAdditionalLinksInfo(body, withdraw.Student, school_year),
        subject: setAdditionalLinksInfo(emailTemplate.subject, withdraw.Student, school_year),
      };
      emailBody.push(temp);

      emailBody.map(async (emailData) => {
        await this.emailService.sendEmail({
          email: emailData.email,
          subject: emailData.subject,
          content: emailData.body,
          from: emailTemplate.from,
          bcc: emailTemplate.bcc,
          region_id: region_id,
          template_name: EmailTemplateEnum.WITHDRAW_PAGE,
        });
      });
      await Promise.all(
        emailBody.map(async (emailData) => {
          return await this.withdrawalEmailService.create({
            withdrawal_id: emailData.withdrawal_id,
            subject: emailData.subject,
            body: emailData.body,
            from_email: emailTemplate.from,
            created_at: new Date(),
          });
        }),
      );
      return true;
    } catch (e) {
      throw new ServiceUnavailableException(e, `${param}`);
    }
  }

  async getStudentInfoByWithdrawalId(withdrawalId: number): Promise<WithdrawalStudentInfo> {
    try {
      let data: WithdrawalStudentInfo = null;
      const queryRunner = await getConnection().createQueryRunner();
      const results = await queryRunner.query(`
        SELECT
          withdrawal.withdrawal_id AS withdrawal_id,
          student.student_id AS student_id,
          student.parent_id AS parent_id,
          gradeLevel.grade_level AS grade,
          person.first_name AS first_name,
          person.last_name AS last_name
        FROM (
          SELECT * FROM infocenter.withdrawal WHERE withdrawal_id = ${withdrawalId}
        ) AS withdrawal
        LEFT JOIN infocenter.mth_student student ON (student.student_id = withdrawal.StudentId)
        LEFT JOIN infocenter.mth_student_grade_level gradeLevel ON (gradeLevel.student_id = student.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
      `);
      if (results) {
        results.map((result) => {
          data = {
            withdrawal_id: Number(result.withdrawal_id),
            student_id: Number(result.student_id),
            parent_id: Number(result.parent_id),
            grade: result.grade,
            first_name: result.first_name,
            last_name: result.last_name,
          };
        });
      }
      await queryRunner.release();
      return data;
    } catch (error) {
      return error;
    }
  }

  async generateWithdrawalFormPdf(withdrawalId: number): Promise<boolean> {
    try {
      const withdraw = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('s_person.person_address', 's_person_address')
        .leftJoinAndSelect('s_person_address.address', 's_address')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('p_person.person_address', 'p_person_address')
        .leftJoinAndSelect('p_person_address.address', 'p_address')
        .leftJoinAndSelect('p_person.person_phone', 'p_person_phone')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .where({ withdrawal_id: withdrawalId })
        .getOne();
      if (!withdraw) throw new ServiceUnavailableException(`Not found Withdrawal data: ${withdrawalId}`);

      const studentId = withdraw?.StudentId;
      if (!studentId) throw new ServiceUnavailableException(`Not found student Id: ${withdrawalId}`);

      const questions = withdraw?.response ? JSON.parse(withdraw.response) : null;

      if (questions?.length) {
        questions.map((item) => {
          switch (item?.type) {
            case 1: {
              item.response = item?.options?.find((option) => option?.value === item?.response)?.label;
              break;
            }
            case 6: {
              item.response = Moment(item?.response).format('MM/DD/YYYY');
              break;
            }
          }
        });
      }

      const schoolYearId = withdraw?.Student?.grade_levels[0]?.school_year_id;
      if (!schoolYearId) throw new ServiceUnavailableException(`Not found schoolYearId: ${withdrawalId}`);
      const schoolYear = await this.schoolYearService.findOneById(schoolYearId);
      if (!schoolYear) throw new ServiceUnavailableException(`Not found schoolYear: ${withdrawalId}`);
      const yearBegin = Moment(schoolYear?.date_begin).format('YYYY');
      const yearEnd = Moment(schoolYear?.date_end).format('YYYY');
      const address =
        withdraw?.Student?.person?.person_address?.address ||
        withdraw?.Student?.parent?.person?.person_address?.address;

      const options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm',
      };
      const pdfBuffer = await this.pdfService.create(
        PdfTemplate.WITHDRAWAL,
        {
          stateLogo: schoolYear?.region?.state_logo,
          studentName: `${withdraw?.Student?.person?.last_name} ${withdraw?.Student?.person?.first_name}`,
          birthdate: withdraw?.Student?.person?.date_of_birth
            ? Moment(withdraw?.Student?.person?.date_of_birth).format('MM/DD/YYYY')
            : 'NA',
          address: address?.street
            ? `${address?.street} ${address?.street2 ? address?.street2 + ' ' : ''}
                ${address?.city || ''}, ${address?.state || ''} ${address?.zip || ''}`
            : 'NA',
          parentPhone: withdraw?.Student?.parent?.person?.person_phone?.number || 'NA',
          parentName: `${withdraw?.Student?.parent?.person?.last_name} ${withdraw?.Student?.parent?.person?.first_name}`,
          grades: gradeText(withdraw?.Student),
          dateEffective: withdraw?.date_effective ? Moment(withdraw?.date_effective).format('MM/DD/YYYY') : 'NA',
          schoolYear: `${yearBegin}-${yearEnd}`,
          date: Moment().format('MM/DD/YYYY'),
          questions,
        },
        options,
      );

      const uploadFile = await this.filesService.upload(
        pdfBuffer,
        S3DirectoryStudentRecords(schoolYear.region?.name, withdraw.StudentId),
        'withdraw_form',
        'application/pdf',
        yearBegin,
      );
      if (!uploadFile) throw new ServiceUnavailableException(`Upload file failed: ${withdrawalId}`);
      await this.studentRecordService.createStudentRecord(
        studentId,
        schoolYear.school_year_id,
        uploadFile.file_id,
        StudentRecordFileKind.WITHDRAWAL_FORM,
      );

      return true;
    } catch (err) {
      console.error('***************************withdrawal pdf error*******************', err);
      throw new ServiceUnavailableException(err, `${withdrawalId}`);
    }
  }
}
