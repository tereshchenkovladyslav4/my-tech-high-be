import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { Pagination } from 'src/paginate';
import { Repository, getConnection, Brackets, QueryRunnerAlreadyReleasedError } from 'typeorm';
import { FilterInput } from '../dto/filter.input';
import { PaginationInput } from '../dto/pagination.input';
import { ResponseDTO } from '../dto/response.dto';
import { Application } from '../models/application.entity';
import { ApplicationUserRegion } from '../models/user-region.entity';
import { Withdrawal, WITHDRAWAL_TABLE_NAME } from '../models/withdrawal.entity';
import { ApplicationsService } from './applications.service';
import { EmailReminderService } from './email-reminder.service';
import { EmailTemplatesService } from './email-templates.service';
import { EmailsService } from './emails.service';
import { ParentsService } from './parents.service';
import { PersonsService } from './persons.service';
import { SchoolYearService } from './schoolyear.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { StudentsService } from './students.service';
import { UserRegionService } from './user-region.service';
import { UsersService } from './users.service';
import { WithdrawalEmailsService } from './withdrawal-emails.service';

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
		private withdrawalEmailService: WithdrawalEmailsService
	) {}

	async save(withdrawal: Withdrawal): Promise<Withdrawal> {
		try {
			const { StudentId, status } = withdrawal;

			if(status == 'Notified') {
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
								`${moment(deadline).format('MM/DD/yy')}`,
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

					await this.withdrawalEmailService.create({
						WithdrawalId: withdrawal.withdrawal_id,
						subject: emailTemplate.subject,
						body: body,
						from_email: emailTemplate.from,
						created_at: new Date(),
					});
					await this.runScheduleReminders(remind_date);
				}
			}

			const result = await this.repo.save({
				StudentId: withdrawal.StudentId,
				status: withdrawal.status,
				date_emailed: withdrawal.status == 'Notified' ? new Date() : null,
				date_effective: withdrawal.date_effective,
			});console.log(result);
			return result;
		} catch (error) {
			return null;
		}
	}

	async delete(withdrawal_id: number): Promise<boolean> {
		try {
			const queryRunner = await getConnection().createQueryRunner();
			await queryRunner.query(`DELETE FROM ${WITHDRAWAL_TABLE_NAME} WHERE withdrawal_id = ${withdrawal_id}`);
			queryRunner.release();
			return true;
		} catch (error) {
			return false;
		}
	}

	async getCountsByStatus(
		filterInput: FilterInput
	): Promise<ResponseDTO> {
		const { filter } = filterInput;
		const values = {};

		let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			LEFT JOIN mth_application application ON (application.student_id = ${WITHDRAWAL_TABLE_NAME}.StudentId)
			LEFT JOIN mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
			LEFT JOIN mth_student student ON (student.student_id = application.student_id)
			LEFT JOIN mth_person person ON (person.person_id = student.person_id)
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
			WHERE ${WITHDRAWAL_TABLE_NAME}.withdrawal_id > 0`;
		
		if(filter.region_id) {
			main_query += ` AND schoolYear.RegionId = ${filter.region_id}`;
		}
		if(filter.status && filter.status.length > 0) {
			main_query += ' AND withdrawal.status IN (""';
			filter.status.forEach(status => {
				main_query += ', "' + status + '"';
			});
			main_query += ')';
		}
		if(filter.keyword && filter.keyword.trim() != '') {
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
		filterInput: FilterInput
	): Promise<Pagination<Withdrawal>> {
		const { skip, take, sort } = paginationInput;
		const { filter } = filterInput;

		let where: any = (qb) => {
		};

		let select_query = `SELECT ${WITHDRAWAL_TABLE_NAME}.*,
		CONCAT(person.first_name, ",", person.last_name) student_name,
		gradeLevel.grade_level`;

		let main_query = ` FROM ${WITHDRAWAL_TABLE_NAME}
			LEFT JOIN mth_application application ON (application.student_id = ${WITHDRAWAL_TABLE_NAME}.StudentId)
			LEFT JOIN mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
			LEFT JOIN mth_student student ON (student.student_id = application.student_id)
			LEFT JOIN mth_person person ON (person.person_id = student.person_id)
			LEFT JOIN mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
			WHERE ${WITHDRAWAL_TABLE_NAME}.withdrawal_id > 0`;
		
		if(filter.region_id) {
			main_query += ` AND schoolYear.RegionId = ${filter.region_id}`;
		}
		if(filter.status && filter.status.length > 0) {
			main_query += ' AND withdrawal.status IN (""';
			filter.status.forEach(status => {
				main_query += ', "' + status + '"';
			});
			main_query += ')';
		}
		if(filter.keyword && filter.keyword.trim() != '') {
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
		switch(sort.split("|")[0]) {
		case "submitted":
			main_query += ` ORDER BY date ${sort.split("|")[1]}`;
			break;
		case "status":
			main_query += ` ORDER BY status ${sort.split("|")[1]}`;
			break;
		case "date_effective":
			main_query += ` ORDER BY effective_date ${sort.split("|")[1]}`;
			break;
		case "student":
			main_query += ` ORDER BY student_name ${sort.split("|")[1]}`;
			break;
		case "grade":
			main_query += ` ORDER BY grade_level ${sort.split("|")[1]}`;
			break;
		case "soe":
			main_query += ` ORDER BY soe ${sort.split("|")[1]}`;
			break;
		case "funding":
			main_query += ` ORDER BY funding ${sort.split("|")[1]}`;
			break;
		case "emailed":
			main_query += ` ORDER BY date_emailed ${sort.split("|")[1]}`;
			break;
		default:
			break;
		}
		//	Pagination
		main_query += ` LIMIT ${skip}, ${take}`;console.log(`${select_query}${main_query}`)
		const results = await queryRunner.query(`${select_query}${main_query}`);
		
		return new Pagination<Withdrawal>({
			results, total: res[0].cnt
		});
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
			console.log(error);
			return error;
		}
	}
}
