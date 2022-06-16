import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateWithdrawalInput } from '../dto/update-withdrawal.inputs';
import { ApplicationUserRegion } from '../models/user-region.entity';
import { Withdrawal } from '../models/withdrawal.entity';
import { EmailTemplatesService } from './email-templates.service';
import { EmailsService } from './emails.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { StudentsService } from './students.service';
import { UserRegionService } from './user-region.service';
import { WithdrawalEmailsService } from './withdrawal-emails.service';
import * as Moment from 'moment';
import { SchoolYearService } from './schoolyear.service';
import { WithdrawalResponse } from '../models/withdrawal-response';
import { EmailReminderService } from './email-reminder.service';

export enum WithdrawalStatus {
  Notified = 'Notified',
  Withdrawn = 'Withdrawn',
  Requested = 'Requested',
}

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    private studentService: StudentsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private userRegionService: UserRegionService,
    private emailTemplateService: EmailTemplatesService,
    private sesEmailService: EmailsService,
    private withdrawalEmailsService: WithdrawalEmailsService,
    private schoolYearService: SchoolYearService,
    private emailReminderService: EmailReminderService,
  ) {}

  async update(
    updateWithdrawalInput: UpdateWithdrawalInput,
  ): Promise<Withdrawal> {
    try {
      const { StudentId, status } = updateWithdrawalInput;

      const withdrawal = await this.withdrawalRepository.save({
        StudentId,
        status,
        date_emailed: status == 'Notified' ? new Date() : null,
      });
      if (status == 'Notified') {
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
        const queryRunner = await getConnection().createQueryRunner();
        const deadlineInfo = await queryRunner.query(
          `SELECT withdraw_deadline_num_days AS deadline FROM infocenter.region WHERE id = ${region_id}`,
        );
        queryRunner.release();
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

            return emailTemplate.body
              .toString()
              .replace(/\[STUDENT\]/g, student.person.first_name)
              .replace(/\[PARENT\]/g, student.parent.person.first_name)
              .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
              .replace(
                /\[APPLICATION_YEAR\]/g,
                `${yearbegin}-${yearend.substring(2, 4)}`,
              )
              .replace(
                /\[LINK\]/g,
                `<a href='${webAppUrl}/parent-link'>${webAppUrl}/parent-link</a>`,
              )
              .replace(
                /\[DEADLINE\]/g,
                `${Moment(deadline).format('MM/DD/yy')}`,
              );
          };

          const school_year = await this.schoolYearService.findOneById(
            gradeLevels[0].school_year_id,
          );

          const body = setEmailBodyInfo(student, school_year);

          await this.sesEmailService.sendEmail({
            email: student.parent?.person?.email,
            subject: emailTemplate.subject,
            content: body,
            bcc: emailTemplate.bcc,
            from: emailTemplate.from,
          });

          await this.withdrawalEmailsService.create({
            WithdrawalId: withdrawal.withdrawal_id,
            subject: emailTemplate.subject,
            body: body,
            from_email: emailTemplate.from,
            created_at: new Date(),
          });
          await this.runScheduleReminders(remind_date);
        }
      }
      return withdrawal;
    } catch (error) {
      return error;
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

  async findAll(region_id: number): Promise<Array<WithdrawalResponse>> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const withdrawals = await queryRunner.query(
        `SELECT
          withdrawals.*,
          person.first_name,
          person.last_name,
          gradeLevel.grade_level
        FROM (
          SELECT * FROM infocenter.withdrawal
        ) AS withdrawals
        LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawals.StudentId)
        LEFT JOIN infocenter.mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
        LEFT JOIN infocenter.mth_student student ON (student.student_id = application.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE
          schoolYear.RegionId = ${region_id}`,
      );
      queryRunner.release();
      const result = withdrawals.map((withdrawal) => ({
        ...withdrawal,
      }));
      return result;
    } catch (error) {
      return [];
    }
  }

  async runScheduleReminders(remind_date: number = 0): Promise<String> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
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
          SELECT StudentId AS student_id, datediff(now(), date) AS diff_date FROM infocenter.withdrawal where status='Notified' and StudentId IS NOT NULL
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
          await this.sesEmailService.sendEmail({
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
      console.log(error);
      return error;
    }
  }
}
