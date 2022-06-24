import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { CoreSetting } from '../models/core-setting.entity';
import { CoreSettingsService } from './core-settings.service';
import { SESService } from './ses.service';
import { EmailInput } from './../dto/email.inputs';
import { User } from '../models/user.entity';
import { EmailVerifier } from '../models/email-verifier.entity';
import { ResponseDTO } from '../dto/response.dto';
import { EmailTemplatesService } from './email-templates.service';
import { UserRegionService } from './user-region.service';
import { ApplicationUserRegion } from '../models/user-region.entity';
import { AnnouncementEmailArgs } from '../dto/announcement-email.args';
import { UserAnnouncementsService } from './user-announcements.service';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { PersonsService } from './persons.service';
import { StudentsService } from './students.service';
import { UsersService } from './users.service';
import { SchoolYearService } from './schoolyear.service';

var base64 = require('base-64');
@Injectable()
export class EmailsService {
  constructor(
    private coreSettingsService: CoreSettingsService,
    private SESService: SESService,
    private emailTemplateService: EmailTemplatesService,
    private userRegionService: UserRegionService,
    private userAnnouncementService: UserAnnouncementsService,
    private usersService: UsersService,
    private studentsService: StudentsService,
    private personsService: PersonsService,
    private studentGradeLevelsService: StudentGradeLevelsService,
    private schoolYearService: SchoolYearService,
  ) {}

  async sendAccountVerificationEmail(
    emailVerifier: EmailVerifier,
    emailInput: EmailInput,
    parent_id: number
  ): Promise<any> {
    let settings = [];
    const webAppUrl = process.env.WEB_APP_URL;

    const regions: ApplicationUserRegion[] =
      await this.userRegionService.findUserRegionByUserId(
        emailVerifier.user_id,
      );

    var region_id = 1;
    if (regions.length != 0) {
      region_id = regions[0].region_id;
    }

    const emailTemplate =
      await this.emailTemplateService.findByTemplateAndRegion(
        'Email Verification',
        region_id,
      );

    // const siteSettings = this.coreSettingsService.getSiteSettings();

    // (await siteSettings).map( coreSetting => {
    //     settings[coreSetting.name] = coreSetting;
    //     return coreSetting;
    // } );
    const token = this.encrypt(emailVerifier);
    // console.log( "settings: ", settings );
    const recipientEmail = emailVerifier.email;
    let subject =
      'Thank you for submitting an application to the My Tech High program test';
    let content =
      '<p>We have received your application to participate in the My Tech High program.</p>';
    content +=
      '<p>Please click on the link below to verify your email address and complete your account registration.</p>';
    content +=
      '<p><a href="' +
      webAppUrl +
      '/confirm/?token=' +
      token +
      '">Click here</a><br></p>';
    content +=
      '<p>*This is just a test, please disregard if you receive this email* - MTH</p>';
    content += ' <p>Â </p>';

    if (emailTemplate) {
      subject = emailTemplate.subject;
      content = emailTemplate.body;
      content +=
        '<p>Please click on the link below to verify your email address and complete your account registration.</p>';
      content +=
        '<p><a href="' +
        webAppUrl +
        '/confirm/?token=' +
        token +
        '">Click here</a><br></p>';
    }

    const user = await this.usersService.findOneByEmail(emailVerifier.email);
    const person = await this.personsService.findOneByUserId(user.user_id);
    const students = await this.studentsService.findOneByParent(
      parent_id,
    );
    const setEmailBodyInfo = (school_year) => {
      const yearbegin = new Date(school_year.date_begin)
        .getFullYear()
        .toString();
      const yearend = new Date(school_year.date_end).getFullYear().toString();
      return content
        .toString()
        .replace(/\[STUDENT\]/g, students[0].person.first_name)
        .replace(/\[PARENT\]/g, person.first_name)
        .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
        .replace(
          /\[APPLICATION_YEAR\]/g,
          `${yearbegin}-${yearend.substring(2, 4)}`,
        );
    };

    if (typeof students !== 'undefined') {
      const gradeLevels = await this.studentGradeLevelsService.forStudents(
        students[0].student_id,
      );

      const school_year = await this.schoolYearService.findOneById(
        gradeLevels[0]?.school_year_id,
      );
      content = setEmailBodyInfo(school_year);
    }

    return this.SESService.sendEmail(
      recipientEmail,
      subject,
      content,
      emailTemplate?.bcc,
      emailTemplate?.from,
    );
  }

  async sendAnnouncementEmail(announcementEmail: AnnouncementEmailArgs) {
    const {
      announcement_id,
      sender,
      subject,
      body,
      RegionId,
      filter_grades,
      filter_users,
    } = announcementEmail;
    const userTypes = JSON.parse(filter_users); // 0: Admin, 1: Parents/Observers, 2: Students, 3: Teachers & Assistants
    const grades = filter_grades
      .replace('[', '(')
      .replace(']', ')')
      .replace('Kindergarten', 'K", "Kin');
    const query = userTypes
      .join(' UNION ')
      .replace('0', 'adminQuery')
      .replace('1', 'parentQuery')
      .replace('2', 'studentQuery')
      .replace('3', 'teacherQuery')
      .replace(
        'adminQuery',
        `SELECT
          Users.email AS email,
          Users.user_id AS UserId
        FROM (
          SELECT user_id, email, level FROM infocenter.core_users
        ) AS Users
        LEFT JOIN infocenter.user_region region ON (region.user_id = Users.user_id)
        LEFT JOIN infocenter.roles role ON (role.level = Users.level)
        WHERE
          region.region_id = ${RegionId} AND role.name = "Admin" `,
      )
      .replace(
        'parentQuery',
        `SELECT
          person.email AS email,
          person.user_id AS UserId
        FROM (
          SELECT student_id, school_year_id FROM infocenter.mth_application
        ) AS applications
        LEFT JOIN infocenter.mth_student student ON (student.student_id = applications.student_id)
        LEFT JOIN infocenter.mth_parent parent ON (parent.parent_id = student.parent_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = parent.person_id)
        LEFT JOIN infocenter.mth_student_grade_level grade ON (grade.student_id = student.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = applications.school_year_id)
        WHERE 
          grade.grade_level IN ${grades} AND
          schoolYear.RegionId = ${RegionId} AND
          person.email IS NOT NULL
        GROUP BY person.email 
        UNION 
        SELECT
          person.email AS email,
          person.user_id AS UserId
        FROM (
          SELECT student_id, school_year_id FROM infocenter.mth_application
        ) AS applications
        LEFT JOIN infocenter.mth_student student ON (student.student_id = applications.student_id)
        LEFT JOIN infocenter.mth_observer observer ON (observer.student_id = student.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = observer.person_id)
        LEFT JOIN infocenter.mth_student_grade_level grade ON (grade.student_id = student.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = applications.school_year_id)
        WHERE 
          grade.grade_level IN ${grades} AND
          schoolYear.RegionId = ${RegionId} AND
          person.email IS NOT NULL
        GROUP BY person.email`,
      )
      .replace(
        'studentQuery',
        `SELECT
          person.email AS email,
          person.user_id AS UserId
        FROM (
          SELECT student_id, school_year_id FROM infocenter.mth_application
        ) AS applications
        LEFT JOIN infocenter.mth_student student ON (student.student_id = applications.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
        LEFT JOIN infocenter.mth_student_grade_level grade ON (grade.student_id = student.student_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = applications.school_year_id)
        WHERE 
          grade.grade_level IN ${grades} AND
          schoolYear.RegionId = ${RegionId} AND
          person.email IS NOT NULL
        GROUP BY person.email`,
      )
      .replace(
        'teacherQuery',
        `SELECT
          Users.email AS email,
          Users.user_id AS UserId
        FROM (
          SELECT user_id, email, level FROM infocenter.core_users
        ) AS Users
        LEFT JOIN infocenter.user_region region ON (region.user_id = Users.user_id)
        LEFT JOIN infocenter.roles role ON (role.level = Users.level)
        WHERE
          region.region_id = ${RegionId} AND (role.name = "Teacher" OR role.name = "Teacher Assistant") `,
      );

    if (query != '') {
      const queryRunner = await getConnection().createQueryRunner();
      const users = await queryRunner.query(query);
      queryRunner.release();
      users.map(async (user) => {
        if (user.email) {
          try {
            await this.sendEmail({
              email: user.email,
              subject,
              content: body,
              from: sender,
            });
          } catch (error) {
            console.log(error, 'Email Error');
          }
        }
        if (user.UserId) {
          await this.userAnnouncementService.save({
            AnnouncementId: announcement_id,
            user_id: user.UserId,
            status: 'Unread',
          });
        }
      });
    }
  }

  async sendEmail(emailInput: EmailInput): Promise<ResponseDTO> {
    const { email, subject, content, bcc, from } = emailInput;

    this.SESService.sendEmail(email, subject, content, bcc, from);

    return <ResponseDTO>{
      error: false,
      message: 'Email Send Successfully',
    };
  }

  encrypt(emailVerifier: EmailVerifier) {
    return base64.encode(
      `${emailVerifier.user_id}-${emailVerifier.email}-${emailVerifier.date_created}`,
    );
  }
}
