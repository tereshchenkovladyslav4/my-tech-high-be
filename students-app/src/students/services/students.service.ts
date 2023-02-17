import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getConnection, Brackets } from 'typeorm';
import { Student } from '../models/student.entity';
import { StudentsArgs } from '../dto/student.args';
import { StudentCurrentStatus } from '../models/student-current-status.entity';
import { SchoolYearsService } from './schoolyears.service';
import { Application } from '../models/application.entity';
import { Packet } from '../models/packet.entity';
import { Person } from '../models/person.entity';
import { User } from '../models/user.entity';
import { Parent } from '../models/parent.entity';
import { StudentStatusService } from './student-status.service';
import { StudentStatus } from '../models/student-status.entity';
import { StudentStatusHistoryService } from './student-status-history.service';
import { StudentStatusHistory } from '../models/student-status-history.entity';
import { StudentGradeLevel } from '../models/student-grade-level.entity';
import { UpdateStudentProfileInput } from '../dto/update-profile.inputs';
import { UsersService } from './users.service';
import { PersonsService } from './persons.service';
import { UserRegion } from '../models/user-region.entity';
import * as Moment from 'moment';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { Region } from '../models/region.entity';
import { Pagination } from 'src/paginate';
import { YEAR_STATUS } from '../enums/year-status.enum';
import { cloneDeep } from 'lodash';
import { Provider } from '../models/provider.entity';
import { StudentsHomeroomArgs } from '../dto/student-homeroom.args';
import { RESOURCE_ACTIVE_STATUSES } from '../constants';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private studentStatusService: StudentStatusService,
    private studentStatusHistoryService: StudentStatusHistoryService,
    private usersService: UsersService,
    private personsService: PersonsService,
    private studentGradeLevelService: StudentGradeLevelsService,
    private schoolYearService: SchoolYearsService,
  ) {}

  protected user: User;
  protected NewUser;

  generatePassword() {
    const characterList = 'mthv2@2022';
    let password = '';
    const characterListLength = characterList.length;

    for (let i = 0; i < 8; i++) {
      const characterIndex = Math.round(Math.random() * characterListLength);
      password = password + characterList.charAt(characterIndex);
    }
    return password;
  }

  async findAll(studentsArgs: StudentsArgs): Promise<Pagination<Student>> {
    // const results = this.studentsRepository.find(studentsArgs);
    const { skip, take, sort, filter, search } = studentsArgs;
    const _sortBy = sort.split('|');
    const currentYear = await this.schoolYearService.findOneById(filter.schoolYear);
    const previousYearOb = await this.schoolYearService.findPreviousYear(
      parseInt(Moment(currentYear.date_begin).format('YYYY')),
      currentYear.RegionId,
    );
    const previousSchoolYear = previousYearOb ? previousYearOb.school_year_id : 0;

    let filterSibling = false;
    let enrolledInStatus = [];

    const studentStatus = filter?.yearStatus || [];
    if (studentStatus.length) {
      filterSibling = studentStatus.includes(YEAR_STATUS.SIBLING);
      enrolledInStatus = studentStatus.filter((el) => el !== YEAR_STATUS.SIBLING);
    }

    const qb = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('student.status', 'status')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('p_person.person_address', 'p_address')
      .leftJoinAndSelect('p_address.address', 'address')
      .leftJoinAndSelect('student.currentSoe', 'currentSoe', `currentSoe.school_year_id=${filter.schoolYear}`)
      .leftJoinAndSelect('currentSoe.partner', 'currentPartner')
      .leftJoinAndSelect('student.previousSoe', 'previousSoe', `previousSoe.school_year_id=${previousSchoolYear}`)
      .leftJoinAndSelect('previousSoe.partner', 'previousPartner')
      .leftJoinAndSelect('student.packets', 'packets')
      .where(`grade_levels.school_year_id = ${filter.schoolYear} AND status.status IN (0, 1)`);

    if (enrolledInStatus.length) {
      qb.andWhere(`student.reenrolled IN (${enrolledInStatus.join(',')})`);
    }
    if (filter && filter.grades && filter.grades.length > 0) {
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
      qb.andWhere(`grade_levels.grade_level IN (${grades.map((el) => `'${el}'`).join(',')})`);
    }
    const schoolDistrict = filter?.schoolDistrict || [];
    const hadFilterSchoolDistrict = schoolDistrict.length && !schoolDistrict.includes('all');

    if (hadFilterSchoolDistrict) {
      qb.andWhere(`packets.school_district IN (${filter.schoolDistrict.map((el) => `'${el}'`).join(',')})`);
    }

    if (filter && filter.schoolOfEnrollments && filter.schoolOfEnrollments.length > 0) {
      const filterSchoolOfEnrollments = filter.schoolOfEnrollments.map((el) => `'${el}'`).join(',');
      if (filter.schoolOfEnrollments.indexOf('unassigned') !== -1) {
        qb.andWhere(
          new Brackets((sub) => {
            sub
              .orWhere(`currentSoe.school_partner_id IN (${filterSchoolOfEnrollments})`)
              .orWhere('currentSoe.school_partner_id IS NULL');
          }),
        );
      } else {
        qb.andWhere(`currentSoe.school_partner_id IN (${filterSchoolOfEnrollments})`);
      }
    }

    if (filter && filter.previousSOE && filter.previousSOE.length > 0) {
      const filterPreviousSOE = filter.previousSOE.map((el) => `'${el}'`).join(',');
      if (filter.previousSOE.indexOf('unassigned') !== -1) {
        qb.andWhere(
          new Brackets((sub) => {
            sub
              .orWhere(`previousSoe.school_partner_id IN (${filterPreviousSOE})`)
              .orWhere('previousSoe.school_partner_id IS NULL');
          }),
        );
      } else {
        qb.andWhere(`previousSoe.school_partner_id IN (${filterPreviousSOE})`);
      }
    }

    if (filter && filter.curriculumProviders && filter.curriculumProviders.length > 0) {
      qb.leftJoinAndSelect('student.StudentSchedules', 'StudentSchedules')
        .leftJoinAndSelect('StudentSchedules.SchedulePeriods', 'SchedulePeriods')
        .andWhere(`SchedulePeriods.ProviderId IN (:curriculumProvider)`, {
          curriculumProvider: filter.curriculumProviders,
        });
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere(`person.first_name like '%${search}%'`)
            .orWhere(`person.last_name like '%${search}%'`)
            .orWhere(`p_person.first_name like '%${search}%'`)
            .orWhere(`p_person.last_name like '%${search}%'`)
            .orWhere(`address.city like '%${search}%'`)
            .orWhere(`grade_levels.grade_level like '%${search}%'`)
            .orWhere(`currentPartner.name like '%${search}%'`)
            .orWhere(`previousPartner.name like '%${search}%'`);
        }),
      );
    }
    if (filterSibling) {
      const queryRunner = await getConnection().createQueryRunner();
      try {
        const qbOnlyParentSelect = cloneDeep(qb);
        qbOnlyParentSelect.select('student.parent_id');
        const [parentsIds] = qbOnlyParentSelect.getQueryAndParameters();
        qb.addSelect('student.*');
        const allStudent = this.studentsRepository
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.grade_levels', 'grade_levels')
          .leftJoinAndSelect('student.status', 'status')
          .leftJoinAndSelect('student.person', 'person')
          .leftJoinAndSelect('student.parent', 'parent')
          .leftJoinAndSelect('parent.person', 'p_person')
          .leftJoinAndSelect('p_person.person_address', 'p_address')
          .leftJoinAndSelect('p_address.address', 'address')
          .leftJoinAndSelect('student.currentSoe', 'currentSoe')
          .leftJoinAndSelect('currentSoe.partner', 'currentPartner')
          .leftJoinAndSelect('student.previousSoe', 'previousSoe')
          .leftJoinAndSelect('previousSoe.partner', 'previousPartner')
          .leftJoinAndSelect('student.packets', 'packets')
          .addSelect('student.*')
          .where(`student.parent_id IN (${parentsIds})`);

        const sortBy = _sortBy?.[1]?.toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
        let sortParent = 'ASC';
        if (sort && _sortBy[0] === 'parent') {
          sortParent = sortBy;
        }
        // RECHECK: parent name order rule
        let orderByFilter = `ORDER BY p_person_last_name ${sortParent}, p_person_first_name ${sortParent}, grade_levels_school_year_id=${filter.schoolYear} DESC`;
        // Group sorting
        if (filter?.grades?.length) {
          const filterGrade = filter.grades;
          if (sort) {
            if (_sortBy[0] === 'grade') {
              filterGrade.sort((a, b) => {
                if (sortBy === 'DESC') return a > b ? -1 : 1;
                else return a > b ? -1 : 1;
              });
            }
          }
          const gradeOrders = filterGrade
            .map((filterValue) => `grade_levels_grade_level='${filterValue}' DESC`)
            .join(',');
          orderByFilter += `, ${gradeOrders}`;
        } else {
          if (sort) {
            if (_sortBy[0] === 'grade') {
              orderByFilter += `, grade_levels_grade_level ${sortBy}`;
            }
          }
        }

        const [sqlAll] = allStudent.getQueryAndParameters();
        const [sql1] = qb.getQueryAndParameters();
        const query = `SELECT *, GROUP_CONCAT(currentPartner_name) AS currentPartner_names, GROUP_CONCAT(previousPartner_name) AS previousPartner_names FROM (${sql1} 
                        UNION ${sqlAll}) aaa GROUP BY student_id`;

        let results = await queryRunner.query(`${query} ${orderByFilter} LIMIT ${skip}, ${take}`);
        const totalRes = await queryRunner.query(`SELECT COUNT(*) AS total FROM (${query}) tt`);

        results = results.map((res) => {
          const rrr = { ...res };

          const currentSoe = [];
          const previousSoe = [];

          if (res.currentPartner_name) {
            currentSoe.push({
              partner: { name: res.currentPartner_name, abbreviation: res.currentPartner_abbreviation },
            });
          }

          if (res.previousPartner_name) {
            previousSoe.push({
              partner: { name: res.previousPartner_name, abbreviation: res.previousPartner_abbreviation },
            });
          }

          rrr.currentSoe = currentSoe;
          rrr.previousSoe = previousSoe;

          return this.studentsRepository.create(rrr);
        });

        return new Pagination<Student>({
          results,
          total: totalRes?.[0]?.total || 0,
        });
      } catch (error) {
        return error;
      } finally {
        await queryRunner.release();
      }
    } else {
      if (sort) {
        const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
        switch (_sortBy[0]) {
          case 'grade':
            qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level1');
            qb.orderBy('student_grade_level1', sortBy);
            break;
          case 'student':
            qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
            qb.orderBy('student_name', sortBy);
            break;
          case 'parent':
            qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
            qb.orderBy('parent_name', sortBy);
            break;
          case 'city':
            qb.orderBy('address.city', sortBy);
            break;
          case 'currentSOE':
            qb.orderBy('currentPartner.name', sortBy);
            break;
          case 'previousSOE':
            qb.orderBy('previousPartner.name', sortBy);
            break;
          default:
            qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
            qb.orderBy('student_name', sortBy);
            break;
        }
      }

      let total = 0,
        results = [];

      if (take !== -1) {
        [results, total] = await qb.skip(skip).take(take).printSql().getManyAndCount();
      } else {
        [results, total] = await qb.printSql().getManyAndCount();
      }

      return new Pagination<Student>({
        results,
        total,
      });
    }
  }

  async findAllForHomeroom(studentsArgs: StudentsHomeroomArgs): Promise<Pagination<Student>> {
    // const results = this.studentsRepository.find(studentsArgs);
    const { skip, take, sort, filter, search } = studentsArgs;
    const _sortBy = sort.split('|');
    const currentYear = await this.schoolYearService.findOneById(filter.schoolYear);
    const previousYearOb = await this.schoolYearService.findPreviousYear(
      parseInt(Moment(currentYear.date_begin).format('YYYY')),
      currentYear.RegionId,
    );
    const previousSchoolYear = previousYearOb ? previousYearOb.school_year_id : 0;

    let filterSibling = false;
    let enrolledInStatus = [];

    const studentStatus = filter?.yearStatus || [];
    if (studentStatus.length) {
      filterSibling = studentStatus.includes(YEAR_STATUS.SIBLING);
      enrolledInStatus = studentStatus.filter((el) => el !== YEAR_STATUS.SIBLING);
    }

    const qb = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('student.status', 'status')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('p_person.person_address', 'p_address')
      .leftJoinAndSelect('p_address.address', 'address')
      .leftJoinAndSelect(
        'student.currentHomeroom',
        'currentHomeroom',
        `currentHomeroom.school_year_id=${filter.schoolYear}`,
      )
      .leftJoinAndSelect('currentHomeroom.Class', 'currentTeacher')
      .leftJoinAndSelect(
        'student.previousHomeroom',
        'previousHomeroom',
        `previousHomeroom.school_year_id=${previousSchoolYear}`,
      )
      .leftJoinAndSelect('previousHomeroom.Class', 'previousTeacher')
      .leftJoinAndSelect('student.packets', 'packets')
      .where(`grade_levels.school_year_id = ${filter.schoolYear} AND status.status IN (0, 1)`);

    if (enrolledInStatus.length) {
      qb.andWhere(`student.reenrolled IN (${enrolledInStatus.join(',')})`);
    }
    if (filter && filter.grades && filter.grades.length > 0) {
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
      qb.andWhere(`grade_levels.grade_level IN (${grades.map((el) => `'${el}'`).join(',')})`);
    }
    const schoolDistrict = filter?.schoolDistrict || [];
    const hadFilterSchoolDistrict = schoolDistrict.length && !schoolDistrict.includes('all');

    if (hadFilterSchoolDistrict) {
      qb.andWhere(`packets.school_district IN (${filter.schoolDistrict.map((el) => `'${el}'`).join(',')})`);
    }

    // for homeroom
    // if (filter && filter.schoolOfEnrollments && filter.schoolOfEnrollments.length > 0) {
    //   const filterSchoolOfEnrollments = filter.schoolOfEnrollments.map((el) => `'${el}'`).join(',');
    //   if (filter.schoolOfEnrollments.indexOf('unassigned') !== -1) {
    //     qb.andWhere(
    //       new Brackets((sub) => {
    //         sub
    //           .orWhere(`currentSoe.school_partner_id IN (${filterSchoolOfEnrollments})`)
    //           .orWhere('currentSoe.school_partner_id IS NULL');
    //       }),
    //     );
    //   } else {
    //     qb.andWhere(`currentSoe.school_partner_id IN (${filterSchoolOfEnrollments})`);
    //   }
    // }

    // for previous homeroom
    // if (filter && filter.previousSOE && filter.previousSOE.length > 0) {
    //   const filterPreviousSOE = filter.previousSOE.map((el) => `'${el}'`).join(',');
    //   if (filter.previousSOE.indexOf('unassigned') !== -1) {
    //     qb.andWhere(
    //       new Brackets((sub) => {
    //         sub
    //           .orWhere(`previousSoe.school_partner_id IN (${filterPreviousSOE})`)
    //           .orWhere('previousSoe.school_partner_id IS NULL');
    //       }),
    //     );
    //   } else {
    //     qb.andWhere(`previousSoe.school_partner_id IN (${filterPreviousSOE})`);
    //   }
    // }

    if (filter && filter.curriculumProviders && filter.curriculumProviders.length > 0) {
      qb.leftJoinAndSelect('student.StudentSchedules', 'StudentSchedules')
        .leftJoinAndSelect('StudentSchedules.SchedulePeriods', 'SchedulePeriods')
        .andWhere(`SchedulePeriods.ProviderId IN (:curriculumProvider)`, {
          curriculumProvider: filter.curriculumProviders,
        });
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere(`person.first_name like '%${search}%'`)
            .orWhere(`person.last_name like '%${search}%'`)
            .orWhere(`p_person.first_name like '%${search}%'`)
            .orWhere(`p_person.last_name like '%${search}%'`)
            .orWhere(`address.city like '%${search}%'`)
            .orWhere(`grade_levels.grade_level like '%${search}%'`);
          // .orWhere(`currentPartner.name like '%${search}%'`)
          // .orWhere(`previousPartner.name like '%${search}%'`);
        }),
      );
    }
    if (filterSibling) {
      const queryRunner = await getConnection().createQueryRunner();
      try {
        const qbOnlyParentSelect = cloneDeep(qb);
        qbOnlyParentSelect.select('student.parent_id');
        const [parentsIds] = qbOnlyParentSelect.getQueryAndParameters();
        qb.addSelect('student.*');
        const allStudent = this.studentsRepository
          .createQueryBuilder('student')
          .leftJoinAndSelect('student.grade_levels', 'grade_levels')
          .leftJoinAndSelect('student.status', 'status')
          .leftJoinAndSelect('student.person', 'person')
          .leftJoinAndSelect('student.parent', 'parent')
          .leftJoinAndSelect('parent.person', 'p_person')
          .leftJoinAndSelect('p_person.person_address', 'p_address')
          .leftJoinAndSelect('p_address.address', 'address')
          .leftJoinAndSelect('student.currentSoe', 'currentSoe')
          .leftJoinAndSelect('currentSoe.partner', 'currentPartner')
          .leftJoinAndSelect('student.previousSoe', 'previousSoe')
          .leftJoinAndSelect('previousSoe.partner', 'previousPartner')
          .leftJoinAndSelect('student.packets', 'packets')
          .addSelect('student.*')
          .where(`student.parent_id IN (${parentsIds})`);

        const sortBy = _sortBy?.[1]?.toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
        let sortParent = 'ASC';
        if (sort && _sortBy[0] === 'parent') {
          sortParent = sortBy;
        }
        // RECHECK: parent name order rule
        let orderByFilter = `ORDER BY p_person_last_name ${sortParent}, p_person_first_name ${sortParent}, grade_levels_school_year_id=${filter.schoolYear} DESC`;
        // Group sorting
        if (filter?.grades?.length) {
          const filterGrade = filter.grades;
          if (sort) {
            if (_sortBy[0] === 'grade') {
              filterGrade.sort((a, b) => {
                if (sortBy === 'DESC') return a > b ? -1 : 1;
                else return a > b ? -1 : 1;
              });
            }
          }
          const gradeOrders = filterGrade
            .map((filterValue) => `grade_levels_grade_level='${filterValue}' DESC`)
            .join(',');
          orderByFilter += `, ${gradeOrders}`;
        } else {
          if (sort) {
            if (_sortBy[0] === 'grade') {
              orderByFilter += `, grade_levels_grade_level ${sortBy}`;
            }
          }
        }

        const [sqlAll] = allStudent.getQueryAndParameters();
        const [sql1] = qb.getQueryAndParameters();
        const query = `SELECT *, GROUP_CONCAT(currentPartner_name) AS currentPartner_names, GROUP_CONCAT(previousPartner_name) AS previousPartner_names FROM (${sql1} 
                        UNION ${sqlAll}) aaa GROUP BY student_id`;

        let results = await queryRunner.query(`${query} ${orderByFilter} LIMIT ${skip}, ${take}`);
        const totalRes = await queryRunner.query(`SELECT COUNT(*) AS total FROM (${query}) tt`);

        results = results.map((res) => {
          const rrr = { ...res };

          const currentSoe = [];
          const previousSoe = [];

          if (res.currentPartner_name) {
            currentSoe.push({
              partner: { name: res.currentPartner_name, abbreviation: res.currentPartner_abbreviation },
            });
          }

          if (res.previousPartner_name) {
            previousSoe.push({
              partner: { name: res.previousPartner_name, abbreviation: res.previousPartner_abbreviation },
            });
          }

          rrr.currentSoe = currentSoe;
          rrr.previousSoe = previousSoe;

          return this.studentsRepository.create(rrr);
        });

        return new Pagination<Student>({
          results,
          total: totalRes?.[0]?.total || 0,
        });
      } catch (error) {
        return error;
      } finally {
        await queryRunner.release();
      }
    } else {
      if (sort) {
        const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
        switch (_sortBy[0]) {
          case 'grade':
            qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level1');
            qb.orderBy('student_grade_level1', sortBy);
            break;
          case 'student':
            qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
            qb.orderBy('student_name', sortBy);
            break;
          case 'parent':
            qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
            qb.orderBy('parent_name', sortBy);
            break;
          case 'city':
            qb.orderBy('address.city', sortBy);
            break;
          // case 'currentSOE':
          //   qb.orderBy('currentPartner.name', sortBy);
          //   break;
          // case 'previousSOE':
          //   qb.orderBy('previousPartner.name', sortBy);
          //   break;
          default:
            qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
            qb.orderBy('student_name', sortBy);
            break;
        }
      }

      let total = 0,
        results = [];

      if (take !== -1) {
        [results, total] = await qb.skip(skip).take(take).printSql().getManyAndCount();
      } else {
        [results, total] = await qb.printSql().getManyAndCount();
      }

      return new Pagination<Student>({
        results,
        total,
      });
    }
  }

  findOneById(student_id: number): Promise<Student> {
    return this.studentsRepository.findOne({
      where: { student_id },
      relations: ['currentSoe', 'currentSoe.partner'],
    });
  }

  findOneByPersonId(person_id: number): Promise<Student> {
    return this.studentsRepository.findOne(person_id);
  }

  async forUsers(user_id: number): Promise<Student[]> {
    const parent = await createQueryBuilder(Parent)
      .innerJoin(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoin(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getOne();

    if (parent !== undefined) {
      return await this.studentsRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.person', 'person')
        .leftJoinAndSelect('student.StudentSchedules', 'StudentSchedules')
        .where('student.parent_id = :parentId', {
          parentId: parent.parent_id,
        })
        .orderBy('person.first_name', 'ASC')
        .printSql()
        .getMany();
    } else {
      return [];
    }
  }

  async getCurrentStatus(studentData: Student): Promise<StudentCurrentStatus> {
    const defaultResponse = {
      student_id: studentData.student_id,
      school_year_id: null,
      grade_level: null,
      application_id: null,
      application_status: null,
      application_school_year_id: null,
      application_date_started: null,
      application_date_submitted: null,
      application_date_accepted: null,
      packet_id: null,
      packet_status: null,
      application_deadline_num_days: 0,
      enrollment_packet_deadline_num_days: 0,
      enrollment_packet_date_deadline: null,
      withdraw_deadline_num_days: 0,
      midyear_application: false,
      schedule_builder_close: '0000-00-00',
      schedule_builder_open: '0000-00-00',
      midyear_schedule_close: '0000-00-00',
      midyear_schedule_open: '0000-00-00',
      second_semester_open: '0000-00-00',
      second_semester_close: '0000-00-00',
      special_ed_options: '',
    };

    const parent = await createQueryBuilder(Parent)
      .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
      .innerJoinAndSelect(Region, 'region', 'region.id = userRegion.region_id')
      .where('`Parent`.parent_id = :parentId', {
        parentId: studentData.parent_id,
      })
      .printSql()
      .getRawOne();

    const region_id = (parent && parent.userRegion_region_id) || null;
    if (!region_id) {
      return defaultResponse;
    }
    // const schoolYear = await this.schoolYearsService.getCurrent(region_id);
    const studentGradeLevel = await this.studentGradeLevelService.findByStudentID(studentData.student_id);

    if (!studentGradeLevel) {
      return defaultResponse;
    }

    const schoolYear = await this.schoolYearService.findOneById(studentGradeLevel.school_year_id);

    const student = await createQueryBuilder(Student)
      .leftJoinAndSelect(Application, 'application', 'application.student_id = `Student`.student_id')
      .leftJoinAndSelect(Packet, 'packet', 'packet.student_id = `Student`.student_id')
      .leftJoinAndSelect(
        StudentGradeLevel,
        'gradelevel',
        'gradelevel.student_id = `Student`.student_id AND gradelevel.school_year_id = application.school_year_id',
      )
      .andWhere('application.school_year_id = :schoolYear', {
        schoolYear: (studentGradeLevel && studentGradeLevel.school_year_id) || null,
      })
      .andWhere('`Student`.student_id = :studentId', { studentId: studentData.student_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getRawOne();

    return {
      student_id: (student && student.Student_student_id) || studentData.student_id,
      school_year_id: studentGradeLevel.school_year_id || null,
      grade_level: (student && student.gradelevel_grade_level) || null,
      application_id: (student && student.application_application_id) || null,
      application_status: (student && student.application_status) || null,
      application_school_year_id: (student && student.application_school_year_id) || null,
      application_date_started: (student && student.application_date_started) || null,
      application_date_submitted: (student && student.application_date_submitted) || null,
      application_date_accepted: (student && Moment(student.application_date_accepted).format('MMM Do, YYYY')) || null,
      packet_id: (student && student.packet_packet_id) || null,
      packet_status: (student && student.packet_status) || null,
      application_deadline_num_days: parent.region_application_deadline_num_days,
      enrollment_packet_deadline_num_days: parent.region_enrollment_packet_deadline_num_days,
      enrollment_packet_date_deadline: student?.packet_deadline
        ? Moment(student.packet_deadline).format('MM.DD')
        : (student &&
            Moment(student.application_date_accepted)
              .add(parent.region_enrollment_packet_deadline_num_days, 'd')
              .format('MM.DD')) ||
          null,
      withdraw_deadline_num_days: parent.region_withdraw_deadline_num_days,
      midyear_application: (student && student.application_midyear_application) || false,
      schedule_builder_close: schoolYear.schedule_builder_close || '0000-00-00',
      schedule_builder_open: schoolYear.schedule_builder_open || '0000-00-00',
      midyear_schedule_close: schoolYear.midyear_schedule_close || '0000-00-00',
      midyear_schedule_open: schoolYear.midyear_schedule_open || '0000-00-00',
      second_semester_open: schoolYear.second_semester_open || '0000-00-00',
      second_semester_close: schoolYear.second_semester_close || '0000-00-00',
      special_ed_options: schoolYear.special_ed_options,
    };
  }

  async getStatus(student_id: number): Promise<StudentStatus[]> {
    return this.studentStatusService.findAllById(student_id);
  }

  async getStatusHistory(student_id: number): Promise<StudentStatusHistory[]> {
    return this.studentStatusHistoryService.findAllById(student_id);
  }

  async updateStatus(studentStatus: StudentStatus): Promise<boolean> {
    return this.studentStatusService.updateOrCreate(studentStatus);
  }

  async updateStatusHistory(studentStatusHistory: StudentStatusHistory): Promise<boolean> {
    return this.studentStatusHistoryService.updateOrCreate(studentStatusHistory);
  }

  async updateProfile(student: Student, updateProfileInput: UpdateStudentProfileInput): Promise<Student> {
    const { preferred_first_name, preferred_last_name, email, photo, testing_preference, password } =
      updateProfileInput;

    const person = await createQueryBuilder(Person)
      .where('`Person`.person_id = :personId', { personId: student.person_id })
      .printSql()
      .getOne();

    const currStudent = await createQueryBuilder(Student)
      .where('`Student`.student_id = :studentId', {
        studentId: student.student_id,
      })
      .printSql()
      .getOne();

    // Update Person Data
    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set({
        preferred_first_name,
        preferred_last_name,
        email,
        photo: photo || null,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .update(Student)
      .set({
        testing_preference,
      })
      .where('student_id = :id', { id: currStudent.student_id })
      .execute();

    const { person_id } = person;
    // create user if pass provide
    if (password) {
      const user = await this.usersService.create({
        first_name: person.first_name,
        last_name: person.last_name,
        email: person.email,
        level: 12,
        updateAt: new Date().toString(),
        password,
      });

      // update person id on person
      const { user_id } = user;
      const updatedPerson = await this.personsService.updateUserId({
        person_id,
        user_id,
      });

      if (!updatedPerson) throw new ServiceUnavailableException('Person User ID Not been Updated');
    }

    return student;
  }

  async removeProfilePhoto(student: Student): Promise<Student> {
    const person = await createQueryBuilder(Person)
      .where('`Person`.person_id = :personId', { personId: student.person_id })
      .printSql()
      .getOne();

    // Update Person Data
    await getConnection()
      .createQueryBuilder()
      .update(Person)
      .set({
        photo: null,
      })
      .where('person_id = :id', { id: person.person_id })
      .execute();

    return student;
  }

  async findSiblingsForResource(parentId: number, schoolYearId: number, grades: string): Promise<Student[]> {
    const students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.status', 'StudentStatus')
      .leftJoinAndSelect('student.grade_levels', 'GradeLevels')
      .where(`student.parent_id = ${parentId}`)
      .andWhere(`StudentStatus.school_year_id = ${schoolYearId}`)
      .andWhere(`GradeLevels.school_year_id = ${schoolYearId}`)
      .andWhere(`FIND_IN_SET(GradeLevels.grade_level,'${grades}') <> 0`)
      .andWhere(`StudentStatus.status IN ("${RESOURCE_ACTIVE_STATUSES.join('","')}")`)
      .getMany();
    return students;
  }
}
