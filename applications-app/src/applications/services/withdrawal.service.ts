import { Injectable } from '@nestjs/common';
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
import { ApplicationUserRegion } from '../models/user-region.entity';
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
import { WithdrawalStatus } from '../enums';

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
  ) {}

  async save(withdrawal: Withdrawal): Promise<boolean> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const { StudentId, status, date_effective, response, withdrawal_id } =
        withdrawal;
      const students = await queryRunner.query(
        `SELECT StudentId, withdrawal_id FROM infocenter.withdrawal WHERE StudentId=${StudentId} AND status='${WithdrawalStatus.NOTIFIED}'`,
      );
      let withdrawalResponse;
      let existingWithdrawalId = 0;
      students.map((student) => {
        existingWithdrawalId = student.withdrawal_id;
      });
      withdrawalResponse = await this.repo.save({
        withdrawal_id: withdrawal_id || existingWithdrawalId,
        StudentId: StudentId,
        status: status,
        date_effective: date_effective,
        response: response,
      });

      if (status == WithdrawalStatus.NOTIFIED && students?.length == 0) {
        withdrawal.date_emailed = new Date();

        //	Send email
        const webAppUrl = process.env.WEB_APP_URL;
        const student = await this.studentService.findOneById(StudentId);
        const gradeLevels = await this.studentGradeLevelsService.forStudents(
          student.student_id,
        );

        const regions: ApplicationUserRegion[] =
          await this.userRegionService.findUserRegionByUserId(
            student.parent?.person?.user_id,
          );

        let region_id = 1;
        if (regions.length > 0) {
          region_id = regions[0].region_id;
        }

        const emailTemplate =
          await this.emailTemplateService.findByTemplateAndRegion(
            'Notify of Withdraw',
            region_id,
          );

        let deadline = new Date();
        let remind_date = 0;
        const deadlineInfo = await queryRunner.query(
          `SELECT withdraw_deadline_num_days AS deadline FROM infocenter.region WHERE id = ${region_id}`,
        );
        deadlineInfo.map((item) => {
          deadline.setDate(deadline.getDate() + item.deadline);
          remind_date = item.deadline;
        });

        if (emailTemplate) {
          const setEmailBodyInfo = (student, school_year) => {
            const yearbegin = new Date(school_year.date_begin)
              .getFullYear()
              .toString();
            const yearend = new Date(school_year.date_end)
              .getFullYear()
              .toString();

            const link = `${webAppUrl}/parent-link/withdrawal/${StudentId}`;

            return emailTemplate.body
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
              .replace(/\[LINK\]/g, `<a href='${link}'>${link}</a>`)
              .replace(
                /\[DEADLINE\]/g,
                `${Moment(deadline).format('MM/DD/yy')}`,
              );
          };

          const school_year = await this.schoolYearService.findOneById(
            gradeLevels[0].school_year_id,
          );

          const body = setEmailBodyInfo(student, school_year);

          await this.emailService.sendEmail({
            email: student.parent?.person?.email,
            subject: emailTemplate.subject,
            content: body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
          });
          if (withdrawalResponse?.withdrawal_id) {
            await this.withdrawalEmailService.create({
              withdrawal_id: withdrawalResponse?.withdrawal_id,
              subject: emailTemplate.subject,
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
      queryRunner.release();
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(student_id: number): Promise<boolean> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      await queryRunner.query(
        `DELETE FROM infocenter.withdrawal WHERE StudentId=${student_id}`,
      );
      queryRunner.release();
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
    let query = `SELECT ${WITHDRAWAL_TABLE_NAME}.status ${main_query} ORDER BY date DESC LIMIT 0, 1`;
    let qb = await this.repo.query(query);
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
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
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
      let key: string = filter.keyword.trim();
      main_query += ` AND (
					date LIKE "%${key}%"
					OR date_effective LIKE "%${key}%"
					OR CONCAT(person.first_name, person.last_name) LIKE "%${key}%"
					OR soe LIKE "%${key}%"
					OR date_emailed LIKE "%${key}%")`;
    }

    //	Get total count
    let query = `SELECT ${WITHDRAWAL_TABLE_NAME}.status, COUNT(*) cnt ${main_query} GROUP BY status ORDER BY status`;
    let qb = await this.repo.query(query);
    qb.map((item) => {
      values[item.status] = +item.cnt;
    });

    return <ResponseDTO>{
      error: false,
      results: values,
    };
  }

  async find(
    paginationInput: PaginationInput,
    filterInput: FilterInput,
  ): Promise<Pagination<Withdrawal>> {
    const { skip, take, sort } = paginationInput;
    const { filter } = filterInput;

    let where: any = (qb) => {};

    let select_query = `SELECT ${WITHDRAWAL_TABLE_NAME}.withdrawal_id, ${WITHDRAWAL_TABLE_NAME}.status, ${WITHDRAWAL_TABLE_NAME}.soe, ${WITHDRAWAL_TABLE_NAME}.funding, 
    ${WITHDRAWAL_TABLE_NAME}.date_effective, ${WITHDRAWAL_TABLE_NAME}.response,${WITHDRAWAL_TABLE_NAME}.date,
		CONCAT(person.first_name, ",", person.last_name) student_name,
		gradeLevel.grade_level, emails.email_date AS date_emailed`;

    let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			LEFT JOIN mth_application application ON (application.student_id = ${WITHDRAWAL_TABLE_NAME}.StudentId)
			LEFT JOIN mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
			LEFT JOIN mth_student student ON (student.student_id = application.student_id)
			LEFT JOIN mth_person person ON (person.person_id = student.person_id)
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
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
      let key: string = filter.keyword.trim();
      main_query += ` AND (
					date LIKE "%${key}%"
					OR date_effective LIKE "%${key}%"
					OR CONCAT(person.first_name, person.last_name) LIKE "%${key}%"
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
        main_query += ` ORDER BY gradeLevel.grade_level+0 ${
          sort.split('|')[1]
        }`;
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
    queryRunner.release();

    return new Pagination<Withdrawal>({
      results,
      total: res[0].cnt,
    });
  }

  async runScheduleReminders(remind_date: number = 0): Promise<String> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
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
          SELECT withdrawal_id, StudentId AS student_id, datediff(now(), date) AS diff_date FROM infocenter.withdrawal WHERE status='${WithdrawalStatus.NOTIFIED}' and StudentId IS NOT NULL
        ) AS withdrawal
        LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawal.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        LEFT JOIN infocenter.region region ON (region.id = schoolYear.RegionId)
        LEFT JOIN infocenter.mth_student student ON (student.student_id = withdrawal.student_id)
        LEFT JOIN infocenter.mth_person studentInfo ON (studentInfo.person_id = student.person_id)
        LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
        LEFT JOIN infocenter.email_templates templates ON (templates.title = 'Undeclared Withdraw' AND templates.region_id = schoolYear.RegionId)
        WHERE 
          region.withdraw_deadline_num_days < withdrawal.diff_date AND 
          templates.id IS NOT NULL
      `);
      withdrawals.map(async (withdrawal) => {
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
        const yearbegin = new Date(date_begin).getFullYear().toString();
        const yearend = new Date(date_end).getFullYear().toString();
        const result = await this.emailService.sendEmail({
          email: parent_email,
          subject: email_subject,
          content: email_body
            .toString()
            .replace(/\[STUDENT\]/g, student_name)
            .replace(/\[PARENT\]/g, parent_name)
            .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
            .replace(/\[Student\]/g, student_name)
            .replace(/\[Parent\]/g, parent_name)
            .replace(/\[Year\]/g, `${yearbegin}-${yearend.substring(2, 4)}`),
          from: email_from,
          bcc: email_bcc,
        });
        await queryRunner.query(
          `UPDATE infocenter.withdrawal SET response = 'undeclared', status='${WithdrawalStatus.WITHDRAWN}' WHERE withdrawal_id = ${withdrawal_id}`,
        );
      });
      // To send remider email to parent by deadline
      const reminders = await queryRunner.query(`
				SELECT
					withdrawal.*,
					region.withdraw_deadline_num_days - withdrawal.diff_date AS remain_date,
					region.id AS region_id,
					person.email AS parent_email,
					templates.id AS email_templates_id,
					templates.bcc AS email_bcc,
					templates.from AS email_from
				FROM (
					SELECT StudentId AS student_id, datediff(now(), date) AS diff_date FROM infocenter.withdrawal WHERE status='${
            WithdrawalStatus.NOTIFIED
          }' and StudentId IS NOT NULL
				) AS withdrawal
				LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawal.student_id)
				LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
				LEFT JOIN infocenter.region region ON (region.id = schoolYear.RegionId)
				LEFT JOIN infocenter.mth_student student ON (student.student_id = withdrawal.student_id)
				LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
				LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
				LEFT JOIN infocenter.email_templates templates ON (templates.title = 'Notify of Withdraw' AND templates.region_id = schoolYear.RegionId)
				WHERE 
					${
            remind_date > 0
              ? 'withdrawal.diff_date = 0'
              : 'region.withdraw_deadline_num_days > withdrawal.diff_date'
          } AND 
					templates.id IS NOT NULL
			`);
      reminders.map(async (reminder) => {
        const {
          remain_date,
          parent_email,
          email_templates_id,
          email_bcc,
          email_from,
        } = reminder;
        const emailReminders =
          await this.emailReminderService.findByTemplateIdAndReminder(
            email_templates_id,
            Number(remain_date),
          );
        emailReminders.map(async (emailReminder) => {
          await this.emailService.sendEmail({
            email: parent_email,
            subject: emailReminder.subject,
            content: emailReminder.body,
            bcc: email_bcc,
            from: email_from,
          });
        });
      });
      queryRunner.release();
      return 'Successfully run schedule reminders.';
    } catch (error) {
      return error;
    }
  }

  async sendEmail(
    emailWithdrawalInput: EmailWithdrawalInput,
  ): Promise<WithdrawalEmail[]> {
    const { withdrawal_ids, subject, from, body, region_id } =
      emailWithdrawalInput;
    const [results] = await this.repo
      .createQueryBuilder('withdrawal')
      .leftJoinAndSelect('withdrawal.Student', 'student')
      .leftJoinAndSelect('student.person', 's_person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('student.grade_levels', 'grade')
      .whereInIds(withdrawal_ids)
      .getManyAndCount();

    const setEmailBodyInfo = (student, school_year) => {
      const yearbegin = new Date(school_year.date_begin)
        .getFullYear()
        .toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();

      return body
        .toString()
        .replace(/\[STUDENT\]/g, student.person.first_name)
        .replace(/\[PARENT\]/g, student.parent.person.first_name)
        .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
        .replace(/\[Student\]/g, student.person.first_name)
        .replace(/\[Parent\]/g, student.parent.person.first_name)
        .replace(/\[Year\]/g, `${yearbegin}-${yearend.substring(2, 4)}`);
    };

    const emailBody = [];
    results.map(async (item) => {
      const school_year = await this.schoolYearService.findOneById(
        item.Student.grade_levels[0].school_year_id,
      );
      const temp = {
        withdrawal_id: item.withdrawal_id,
        email: item.Student.parent.person.email,
        body: setEmailBodyInfo(item.Student, school_year),
      };
      emailBody.push(temp);
    });
    const emailTemplate =
      await this.emailTemplateService.findByTemplateAndRegion(
        'Withdraw Page',
        region_id,
      );

    emailBody.map(async (emailData) => {
      const result = await this.emailService.sendEmail({
        email: emailData.email,
        subject,
        content: emailData.body,
        from: from || emailTemplate.from,
        bcc: emailTemplate.bcc,
      });
    });
    const withdrawalEmails = Promise.all(
      emailBody.map(async (emailData) => {
        return await this.withdrawalEmailService.create({
          withdrawal_id: emailData.withdrawal_id,
          subject: subject,
          body: emailData.body,
          from_email: from || emailTemplate.from,
          created_at: new Date(),
        });
      }),
    );
    return withdrawalEmails;
  }

  async update(updateWithdrawalInput: UpdateWithdrawalInput): Promise<Boolean> {
    try {
      const withdrawal = await this.repo.findOne(
        updateWithdrawalInput.withdrawal_id,
      );
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

  async quickWithdrawal(param: QuickWithdrawalInput): Promise<Boolean> {
    try {
      const { withdrawal_ids } = param;
      const queryRunner = await getConnection().createQueryRunner();
      const [results] = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .whereInIds(withdrawal_ids)
        .getManyAndCount();
      results
        .filter((item) => item.status == WithdrawalStatus.REQUESTED)
        .map(async (item) => {
          const withdrawal_id = item.withdrawal_id;
          const school_year_id = item.Student.grade_levels[0].school_year_id;
          const studentId = item.Student.student_id;
          await queryRunner.query(
            `UPDATE infocenter.withdrawal SET status = '${WithdrawalStatus.WITHDRAWN}' WHERE withdrawal_id = ${withdrawal_id}`,
          );
          await queryRunner.query(
            `UPDATE infocenter.mth_student_status SET status = 2 WHERE student_id = ${studentId} AND school_year_id = ${school_year_id}`,
          );
        });
      queryRunner.release();
      return true;
    } catch (e) {
      return false;
    }
  }

  async reinstateWithdrawal(param: ReinstateWithdrawalInput): Promise<Boolean> {
    try {
      const { withdrawal_ids, reinstate_type } = param;
      const queryRunner = await getConnection().createQueryRunner();
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
        const withdrawal_id = item.withdrawal_id;
        const school_year_id = item.Student.grade_levels[0].school_year_id;
        const studentId = item.Student.student_id;
        await queryRunner.query(
          `DELETE FROM infocenter.withdrawal WHERE withdrawal_id = ${withdrawal_id}`,
        );
        await queryRunner.query(
          `UPDATE infocenter.mth_student_status SET status = 1 WHERE student_id = ${studentId} AND school_year_id = ${school_year_id}`,
        );
      });
      queryRunner.release();
      return true;
    } catch (e) {
      return false;
    }
  }

  async individualWithdrawal(
    param: IndividualWithdrawalInput,
  ): Promise<Boolean> {
    try {
      const { withdrawal_id, body, type, region_id } = param;
      const queryRunner = await getConnection().createQueryRunner();
      const [results] = await this.repo
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.person', 's_person')
        .leftJoinAndSelect('student.parent', 'parent')
        .leftJoinAndSelect('parent.person', 'p_person')
        .leftJoinAndSelect('student.grade_levels', 'grade')
        .whereInIds(withdrawal_id)
        .getManyAndCount();
      if (type === 1) {
        results
          .filter((item) => item.status == 'Requested')
          .map(async (item) => {
            const withdrawal_id = item.withdrawal_id;
            const school_year_id = item.Student.grade_levels[0].school_year_id;
            const studentId = item.Student.student_id;
            await queryRunner.query(
              `UPDATE infocenter.withdrawal SET status = 'Withdrawn' WHERE withdrawal_id = ${withdrawal_id}`,
            );
            await queryRunner.query(
              `UPDATE infocenter.mth_student_status SET status = 2 WHERE student_id = ${studentId} AND school_year_id = ${school_year_id}`,
            );
          });
      }
      queryRunner.release();

      const setEmailBodyInfo = (student, school_year) => {
        const yearbegin = new Date(school_year.date_begin)
          .getFullYear()
          .toString();
        const yearend = new Date(school_year.date_end).getFullYear().toString();

        return body
          .toString()
          .replace(/\[STUDENT\]/g, student.person.first_name)
          .replace(/\[PARENT\]/g, student.parent.person.first_name)
          .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
          .replace(/\[Student\]/g, student.person.first_name)
          .replace(/\[Parent\]/g, student.parent.person.first_name)
          .replace(/\[Year\]/g, `${yearbegin}-${yearend.substring(2, 4)}`);
      };
      const emailBody = [];
      results.map(async (item) => {
        const school_year = await this.schoolYearService.findOneById(
          item.Student.grade_levels[0].school_year_id,
        );
        const temp = {
          withdrawal_id: item.withdrawal_id,
          email: item.Student.parent.person.email,
          body: setEmailBodyInfo(item.Student, school_year),
        };
        emailBody.push(temp);
      });
      const emailTemplate =
        await this.emailTemplateService.findByTemplateAndRegion(
          'Withdraw Page',
          region_id,
        );

      emailBody.map(async (emailData) => {
        await this.emailService.sendEmail({
          email: emailData.email,
          subject: emailTemplate.subject,
          content: emailData.body,
          from: emailTemplate.from,
          bcc: emailTemplate.bcc,
        });
      });
      Promise.all(
        emailBody.map(async (emailData) => {
          return await this.withdrawalEmailService.create({
            withdrawal_id: emailData.withdrawal_id,
            subject: emailTemplate.subject,
            body: emailData.body,
            from_email: emailTemplate.from,
            created_at: new Date(),
          });
        }),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async getStudentInfoByWithdrawalId(
    withdrawalId: number,
  ): Promise<WithdrawalStudentInfo> {
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
      queryRunner.release();
      return data;
    } catch (error) {
      return error;
    }
  }
}
