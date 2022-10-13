import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository, createQueryBuilder } from 'typeorm';
import { Announcement } from '../models/announcement.entity';
import { CreateAnnouncementInput } from '../dto/new-announcement.inputs';
import { ResponseDTO } from '../dto/response.dto';
import { UpdateAnnouncementInput } from '../dto/update-announcement.inputs';
import { EmailsService } from './emails.service';
import { CronJobService } from './cronJob.service';
import { difference } from 'lodash';

import { User } from '../models/user.entity';
import { UserRegion } from '../models/user-region.entity';
import { Role } from '../models/role.entity';
import { Application } from '../models/application.entity';
import { Student } from '../models/student.entity';
import { Parent } from '../models/parent.entity';
import { Person } from '../models/person.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { Observer } from '../models/observer.entity';
import { SchoolPartner } from '../models/school-partner.entity';
import { AnnouncementFilterArgs } from '../dto/announcement-filter.args';
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,
    private sesEmailService: EmailsService, //private cronJobService: CronJobService,

    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
  ) {}

  async findAll(region_id: number): Promise<Array<Announcement>> {
    try {
      const results = await this.announcementsRepository
        .createQueryBuilder('announcement')
        .where({ RegionId: region_id })
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }

  async findOneById(announcement_id: number): Promise<Announcement> {
    return this.announcementsRepository.findOne(announcement_id);
  }

  async create(announcement: CreateAnnouncementInput): Promise<Announcement> {
    try {
      const result = await this.announcementsRepository.save(announcement);
      if (announcement.status == 'Published' && !announcement.isArchived) {
        const {
          posted_by,
          subject,
          body,
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
        } = announcement;
        // get users
        const userEmailList = await this.getAnnouncementUsersByFilters({
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
        });
        userEmailList.map(async (user) => {
          await this.sesEmailService.sendAnnouncementEmail({
            body,
            subject,
            sender: posted_by,
            user,
            announcementId: result.announcement_id,
          });
        });
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async update(updateAnnouncementInput: UpdateAnnouncementInput): Promise<Announcement> {
    const {
      announcement_id,
      posted_by,
      subject,
      body,
      RegionId,
      filter_grades,
      filter_users,
      status,
      isArchived,
      filter_program_years,
      filter_school_partners,
    } = updateAnnouncementInput;
    const announcementData = await this.announcementsRepository.findOne({
      announcement_id,
    });
    if (announcementData) {
      try {
        const userEmailList = await this.getAnnouncementUsersByFilters({
          RegionId,
          filter_grades,
          filter_users,
          filter_program_years,
          filter_school_partners,
        });
        if ((status == 'Published' && !isArchived) || status === 'Republished') {
          userEmailList.map(async (user) => {
            await this.sesEmailService.sendAnnouncementEmail({
              body,
              subject,
              sender: posted_by,
              user,
              announcementId: announcementData.announcement_id,
            });
          });
        }
        return await this.announcementsRepository.save({
          ...updateAnnouncementInput,
          status: status === 'Republished' ? 'Published' : status,
        });
      } catch (error) {
        return error;
      }
    }
  }

  async deleteById(id: number): Promise<ResponseDTO> {
    try {
      await this.announcementsRepository.delete({ announcement_id: id });
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

  async getAnnouncementUsersByFilters(announcementEmailInputs: AnnouncementFilterArgs): Promise<User[]> {
    {
      const { RegionId, filter_grades, filter_users, filter_program_years, filter_school_partners } =
        announcementEmailInputs;

      const userTypes = JSON.parse(filter_users); // 0: Admin, 1: Parents/Observers, 2: Students, 3: Teachers & Assistants
      const roleNameFilters = [];

      if (userTypes.indexOf('0') > -1) roleNameFilters.push('Admin');

      if (userTypes.indexOf('3') > -1) {
        roleNameFilters.push('Teacher');
        roleNameFilters.push('Teacher Assistant');
      }

      let adminTeachersResults = [];
      if (userTypes.indexOf('0') > -1 || userTypes.indexOf('3') > -1) {
        const adminTeacherUsers = await createQueryBuilder(User)
          .leftJoin(UserRegion, 'userRegion', 'userRegion.user_id = `User`.user_id')
          .leftJoin(Role, 'roles', 'roles.level = `User`.level')
          .select('`User`.user_id', 'user_id')
          .addSelect('`User`.email', 'email')
          .where('userRegion.region_id = :regionId', { regionId: RegionId })
          .andWhere('roles.name IN(:...roleNames)', {
            roleNames: roleNameFilters,
          })
          .printSql()
          .getRawMany();

        adminTeachersResults = JSON.parse(JSON.stringify(adminTeacherUsers));
      }

      const grades = filter_grades.replace('Kindergarten', 'K", "Kin');
      const gradeTypes = JSON.parse(grades);

      const programYearTypes = JSON.parse(filter_program_years);
      //const schoolYearId = programYearTypes.indexOf('schoolYear') > -1 ? 15 : 0;
      const isMidYear = programYearTypes.indexOf('midYear') > -1 ? 1 : 0;

      const schoolPartnerTypes = JSON.parse(filter_school_partners);
      const schoolPartners = schoolPartnerTypes;

      //console.log('SchoolPartners: ', schoolPartners);

      let parentResults = [];
      if (userTypes.indexOf('1') > -1) {
        const parentQuery = this.applicationsRepository
          .createQueryBuilder('application')
          .leftJoin(Student, 'student', 'student.student_id = application.student_id')
          .leftJoin(Observer, 'observer', 'observer.student_id = student.student_id')
          .leftJoin(Parent, 'parent', 'parent.parent_id = student.parent_id')
          .leftJoinAndSelect(Person, 'person', 'person.person_id = parent.person_id')
          .leftJoin(StudentGradeLevel, 'studentGradeLevel', 'studentGradeLevel.student_id = student.student_id')
          .leftJoin(SchoolYear, 'schoolYear', 'schoolYear.school_year_id = application.school_year_id')
          .leftJoin(SchoolPartner, 'schoolPartner', 'schoolPartner.school_year_id = schoolYear.school_year_id')
          .select('person.user_id', 'user_id')
          .addSelect('person.email', 'email')
          .distinct(true)
          //.where('schoolYear.school_year_id = :schoolYearId', { schoolYearId })
          //.andWhere('application.midyear_application = :isMidYear', { isMidYear })
          .where('studentGradeLevel.grade_level IN(:...grades)', {
            grades: gradeTypes,
          })
          // .andWhere(
          //   'IFNULL( application.midyear_application, 0 ) = :isMidYear',
          //   {
          //     isMidYear,
          //   },
          // )
          //.andWhere('schoolYear.school_year_id = :schoolYearId', { schoolYearId })
          .andWhere('schoolYear.RegionId = :regionId', { regionId: RegionId })
          .andWhere('person.email IS NOT NULL');
        //.printSql()
        //.getRawMany();

        if (Array.isArray(isMidYear) && isMidYear > 0)
          parentQuery.andWhere('IFNULL( application.midyear_application, 0 ) = :isMidYear', {
            isMidYear,
          });

        if (Array.isArray(schoolPartners)) {
          parentQuery.andWhere('schoolPartner.school_partner_id IN(:...schoolPartnerIds)', {
            schoolPartnerIds: schoolPartners,
          });
        }

        // if (schoolYearId > 0)
        //   parentUsers.andWhere('schoolYear.school_year_id = :schoolYearId', {
        //     schoolYearId,
        //   });

        const parentUsers = await parentQuery.printSql().getRawMany();

        parentResults = JSON.parse(JSON.stringify(parentUsers));
      }

      const announcementUsers = [
        ...new Map([...adminTeachersResults, ...parentResults].map((item) => [item['email'], item])).values(),
      ];

      return announcementUsers as User[];
    }
  }
}
