import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { UserAnnouncement } from '../models/user-announcement.entity';
import { UserAnnouncementInput } from '../dto/user-announcement.inputs';
import { UserAnnouncementResponse } from '../dto/user-announcement.response';
import { ResponseDTO } from '../dto/response.dto';
import { UserAnnouncementRequestParams } from '../dto/user-announcement-request-param';
@Injectable()
export class UserAnnouncementsService {
  constructor(
    @InjectRepository(UserAnnouncement)
    private readonly userAnnouncementsRepository: Repository<UserAnnouncement>,
  ) {}

  async findAll(
    request: UserAnnouncementRequestParams,
  ): Promise<Array<UserAnnouncementResponse>> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const { limit, user_id, search } = request;
      let condition = '';
      if (search) {
        condition = `
          WHERE 
            announcement.subject LIKE '%${search}%' OR
            announcement.body LIKE '%${search}%'
        `;
        const grades = await queryRunner.query(`
          SELECT
            grade.grade_level AS gradeLevel
          FROM (
            SELECT person_id FROM infocenter.mth_person WHERE user_id = ${user_id}
          ) AS user
          LEFT JOIN infocenter.mth_parent parent ON (parent.person_id = user.person_id)
          LEFT JOIN infocenter.mth_student student ON (student.parent_id = parent.parent_id)
          LEFT JOIN infocenter.mth_person studentInfo ON (studentInfo.person_id = student.person_id)
          LEFT JOIN infocenter.mth_student_grade_level grade ON (grade.student_id = student.student_id)
          WHERE
            CONCAT(studentInfo.first_name, '', studentInfo.last_name) LIKE '%${search}%'
        `);
        grades.forEach((grade) => {
          condition += ` OR announcement.filter_grades LIKE '%${grade.gradeLevel}%'`;
        });
      }

      const userAnnouncements = (await queryRunner.query(`SELECT
        userAnnouncements.*,
          announcement.posted_by AS sender,
          announcement.subject,
          announcement.body,
          announcement.RegionId,
          announcement.filter_grades,
          announcement.date
        FROM (
          SELECT id, AnnouncementId AS announcement_id, user_id, status FROM infocenter.user_announcement WHERE user_id = ${user_id}
        ) AS userAnnouncements
        LEFT JOIN infocenter.announcement announcement ON (announcement.announcement_id = userAnnouncements.announcement_id)
        ${condition}
        ORDER BY announcement.date DESC
        LIMIT 0, ${limit}`)) as UserAnnouncementResponse[];
      queryRunner.release();
      return userAnnouncements;
    } catch (error) {
      return error;
    }
  }

  async deleteAll(user_id: number): Promise<ResponseDTO> {
    try {
      await this.userAnnouncementsRepository.delete({ user_id: user_id });
      return <ResponseDTO>{
        error: false,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return <ResponseDTO>{
        error: true,
        message: 'Delete Failed',
      };
    }
  }

  async deleteById(id: number): Promise<ResponseDTO> {
    try {
      await this.userAnnouncementsRepository.delete({ id });
      return <ResponseDTO>{
        error: false,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      return <ResponseDTO>{
        error: true,
        message: 'Delete Failed',
      };
    }
  }

  async save(announcement: UserAnnouncementInput): Promise<UserAnnouncement> {
    try {
      return await this.userAnnouncementsRepository.save(announcement);
    } catch (error) {
      return error;
    }
  }

  async findById(id: number): Promise<UserAnnouncement | undefined>  {
    return await this.userAnnouncementsRepository.findOne({ AnnouncementId: id })
  }
}
