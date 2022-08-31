import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PDFService } from '@t00nday/nestjs-pdf';
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
import moment, * as Moment from 'moment';
import { StudentGradeLevelsService } from './student-grade-levels.service';
import { Region } from '../models/region.entity';
import { Pagination } from 'src/paginate';
import { ChangeStatusInput } from '../dto/change-status.input';
import { PdfTemplate, StudentRecordFileKind } from '../enums';
import { FilesService } from './files.service';
import { StudentRecordService } from './student-record.service';
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private schoolYearsService: SchoolYearsService,
    private studentStatusService: StudentStatusService,
    private studentStatusHistoryService: StudentStatusHistoryService,
    private usersService: UsersService,
    private personsService: PersonsService,
    private studentGradeLevelService: StudentGradeLevelsService,
    private schoolYearService: SchoolYearsService,
    private pdfService: PDFService,
    private filesService: FilesService,
    private studentRecordService: StudentRecordService,
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
    const previousScholYear = previousYearOb ? previousYearOb.school_year_id : 0;

    const qb = this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.grade_levels', 'grade_levels')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.parent', 'parent')
      .leftJoinAndSelect('parent.person', 'p_person')
      .leftJoinAndSelect('p_person.person_address', 'p_address')
      .leftJoinAndSelect('p_address.address', 'address')
      .leftJoinAndSelect('student.currentSoe', 'currentSoe', 'currentSoe.school_year_id= :currentSchoolYear', {
        currentSchoolYear: filter.schoolYear,
      })
      .leftJoinAndSelect('currentSoe.partner', 'currentPartner')
      .leftJoinAndSelect('student.previousSoe', 'previousSoe', 'previousSoe.school_year_id= :previousScholYear', {
        previousScholYear: previousScholYear,
      })
      .leftJoinAndSelect('previousSoe.partner', 'previousPartner')
      .leftJoinAndSelect('student.packets', 'packets')
      .where(`grade_levels.school_year_id = ${filter.schoolYear}`);

    if (filter && filter.grades && filter.grades.length > 0) {
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

    const studentStatus = filter?.yearStatus || [];
    if (studentStatus.length) {
      qb.andWhere('student.reenrolled IN (:studentStatus)', { studentStatus });
    }

    const schoolDistrict = filter?.schoolDistrict || [];
    const hadFilterSchoolDistrict = schoolDistrict.length && !schoolDistrict.includes('all');

    if (hadFilterSchoolDistrict) {
      qb.andWhere('packets.school_district IN (:...names)', {
        names: filter.schoolDistrict,
      });
    }

    if (filter && filter.schoolOfEnrollments && filter.schoolOfEnrollments.length > 0) {
      if (filter.schoolOfEnrollments.indexOf('unassigned') !== -1) {
        qb.andWhere(
          new Brackets((sub) => {
            sub
              .orWhere('currentSoe.school_partner_id IN (:currentPartners)', {
                currentPartners: filter.schoolOfEnrollments,
              })
              .orWhere('currentSoe.school_partner_id IS NULL');
          }),
        );
      } else {
        qb.andWhere('currentSoe.school_partner_id IN (:currentPartners)', {
          currentPartners: filter.schoolOfEnrollments,
        });
      }
    }

    if (filter && filter.previousSOE && filter.previousSOE.length > 0) {
      if (filter.previousSOE.indexOf('unassigned') !== -1) {
        qb.andWhere(
          new Brackets((sub) => {
            sub
              .orWhere('previousSoe.school_partner_id IN (:previousPartner)', { previousPartner: filter.previousSOE })
              .orWhere('previousSoe.school_partner_id IS NULL');
          }),
        );
      } else {
        qb.andWhere('previousSoe.school_partner_id IN (:previousPartner)', { previousPartner: filter.previousSOE });
      }
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub
            .orWhere('person.first_name like :text', { text: `%${search}%` })
            .orWhere('person.last_name like :text', { text: `%${search}%` })
            .orWhere('p_person.first_name like :text', { text: `%${search}%` })
            .orWhere('p_person.last_name like :text', { text: `%${search}%` })
            .orWhere('address.city like :text', { text: `%${search}%` })
            .orWhere('grade_levels.grade_level like :text', {
              text: `%${search}%`,
            })
            .orWhere('currentPartner.name like :text', { text: `%${search}%` })
            .orWhere('previousPartner.name like :text', {
              text: `%${search}%`,
            });
        }),
      );
    }

    if (sort) {
      if (_sortBy[1].toLocaleLowerCase() === 'desc') {
        if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level1');
          qb.orderBy('student_grade_level1', 'DESC');
        } else if (_sortBy[0] === 'student') {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'DESC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
          qb.orderBy('parent_name', 'DESC');
        } else if (_sortBy[0] === 'city') {
          qb.orderBy('address.city', 'DESC');
        } else if (_sortBy[0] === 'currentSOE') {
          qb.orderBy('currentPartner.name', 'DESC');
        } else if (_sortBy[0] === 'previousSOE') {
          qb.orderBy('previousPartner.name', 'DESC');
        } else {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'DESC');
        }
      } else {
        if (_sortBy[0] === 'grade') {
          qb.addSelect('ABS(grade_levels.grade_level + 0)', 'student_grade_level1');
          qb.orderBy('student_grade_level1', 'ASC');
        } else if (_sortBy[0] === 'student') {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'ASC');
        } else if (_sortBy[0] === 'parent') {
          qb.addSelect("CONCAT(p_person.last_name, ' ', p_person.first_name)", 'parent_name');
          qb.orderBy('parent_name', 'ASC');
        } else if (_sortBy[0] === 'city') {
          qb.orderBy('address.city', 'ASC');
        } else if (_sortBy[0] === 'currentSOE') {
          qb.orderBy('currentPartner.name', 'ASC');
        } else if (_sortBy[0] === 'previousSOE') {
          qb.orderBy('previousPartner.name', 'ASC');
        } else {
          qb.addSelect("CONCAT(person.last_name, ' ', person.first_name)", 'student_name');
          qb.orderBy('student_name', 'ASC');
        }
      }
    }

    const [results, total] = await qb.skip(skip).take(take).printSql().getManyAndCount();

    return new Pagination<Student>({
      results,
      total,
    });
  }

  findOneById(student_id: number): Promise<Student> {
    return this.studentsRepository.findOne({
      where: { student_id },
      relations: ['currentSoe'],
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

    // console.log('ParentData: ', parent);

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
      .andWhere('`Student`.student_id = :studentId', {
        studentId: studentData.student_id,
      })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getRawOne();

    //console.log('Student: ', student);
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
      enrollment_packet_date_deadline:
        (student &&
          Moment(student.application_date_accepted)
            .add(parent.region_application_deadline_num_days, 'd')
            .format('MM.DD')) ||
        null,
      withdraw_deadline_num_days: parent.region_withdraw_deadline_num_days,
    };
  }

  async getStatus(student_id: number): Promise<StudentStatus[]> {
    return this.studentStatusService.findAllById(student_id);
  }

  async getStatusHistory(student_id: number): Promise<StudentStatusHistory[]> {
    return this.studentStatusHistoryService.findAllById(student_id);
  }

  async updateStatus(studentStatus: StudentStatus): Promise<Boolean> {
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
        firstName: person.first_name,
        lastName: person.last_name,
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
      console.log('Updated Person: ', updatedPerson);
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

  async generateStudentPacketPDF(param: ChangeStatusInput): Promise<boolean> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const { student_id, packet_id } = param;
      const studentInfoResult = await queryRunner.query(`
        SELECT
          region.id AS region_id,
          region.name AS region_name,
          schoolYear.school_year_id AS school_year_id,
          schoolYear.date_begin AS date_begin,
          CONCAT(person.first_name, ' ', person.last_name) AS legal_name,
          CONCAT(person.preferred_first_name, '', preferred_last_name) AS preferred_name,
          person.email AS email,
          person.date_of_birth AS date_of_birth,
          person.gender AS gender,
          CONCAT(studentGrade.grade_level, ' (', SUBSTR(schoolYear.date_begin, 1, 4), '-', SUBSTR(schoolYear.date_end, 3, 2), ')') AS grade
        FROM (
          SELECT student_id, school_year_id FROM infocenter.mth_application WHERE student_id = ${student_id}
        ) AS application
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        LEFT JOIN infocenter.region region ON (region.id = schoolYear.RegionId)
        LEFT JOIN infocenter.mth_student student ON (student.student_id = application.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
        LEFT JOIN infocenter.mth_student_grade_level studentGrade ON (studentGrade.student_id = application.student_id AND studentGrade.school_year_id = application.school_year_id)
    
      `);
      let packetInfo = Object.create({
        region_id: '',
        region_name: '',
        school_year_id: '',
        date_begin: '',
        legal_name: '',
        preferred_name: '',
        email: '',
        date_of_birth: '',
        gender: '',
        grade: '',
        hispanic_latino: '',
        race: '',
        first_language_learned_by_child: '',
        language_used_most_often_by_adults_in_the_home: '',
        language_used_most_often_by_child_in_the_home: '',
        language_used_most_often_by_child_with_friends_outside_the_home: '',
        preferred_correspondence_language_for_adults_in_the_home: '',
        special_ed: '',
        school_district_of_residence: '',
        last_school_attended: '',
        parent_guardian_name: '',
        parent_guardian_phone1: '',
        parent_guardian_phone2: '',
        parent_guardian_email: '',
        parent_guardian_address1: '',
        parent_guardian_address2: '',
        secondary_contact_name: '',
        secondary_contact_phone: '',
        secondary_contact_email: '',
        household_size: '',
        household_income: '',
        other_the_student_presently_living: '',
        other_the_student_lives_with: '',
        signature_name: '',
        signature_date: '',
        signature_url: '',
      });
      studentInfoResult.map((item) => {
        packetInfo.region_id = `${item.region_id}`;
        packetInfo.region_name = `${item.region_name}`;
        packetInfo.school_year_id = `${item.school_year_id}`;
        packetInfo.date_begin = `${item.date_begin}`;
        packetInfo.legal_name = `${item.legal_name}`;
        packetInfo.preferred_name = `${item.preferred_name}`;
        packetInfo.email = `${item.email}`;
        packetInfo.date_of_birth = `${Moment(item.date_of_birth).format('MMMM DD, YYYY')}`;
        packetInfo.gender = `${item.gender}`;
        packetInfo.grade = `${item.grade}`;
        packetInfo.hispanic_latino = 'Yes';
        packetInfo.race = 'American Indian or Alaska Native';
        packetInfo.first_language_learned_by_child = 'English';
        packetInfo.language_used_most_often_by_adults_in_the_home = 'English';
        packetInfo.language_used_most_often_by_child_in_the_home = 'English';
        packetInfo.language_used_most_often_by_child_with_friends_outside_the_home = 'English';
        packetInfo.preferred_correspondence_language_for_adults_in_the_home = 'English';
        packetInfo.special_ed = '';
        packetInfo.school_district_of_residence = 'Jordan';
        packetInfo.last_school_attended = 'None - Student has always been homeschooled';
        packetInfo.parent_guardian_name = 'Parent Demo2020';
        packetInfo.parent_guardian_phone1 = '423-367-5555';
        packetInfo.parent_guardian_phone2 = '423-367-5555';
        packetInfo.parent_guardian_email = 'hero930604@hotmail.com';
        packetInfo.parent_guardian_address1 = '1234 Demo Lane';
        packetInfo.parent_guardian_address2 = 'Demo, OR 95337';
        packetInfo.secondary_contact_name = 'Contact Parent2020';
        packetInfo.secondary_contact_phone = '423-367-5555';
        packetInfo.secondary_contact_email = 'hero930604@hotmail.com';
        packetInfo.household_size = '0';
        packetInfo.household_income = 'Not shared';
        packetInfo.other_the_student_presently_living = 'Choices above do not apply (skip question #2)';
        packetInfo.other_the_student_lives_with = '';
        packetInfo.signature_name = 'Parent Demo Test';
        packetInfo.signature_date = ' 06/23/2021';
        packetInfo.signature_url = 'https://cdn.rtbrain.app/pp/preimages/497be9c47119846bc65c4a69c71c1368_wide.jpg';
      });

      queryRunner.release();

      const region = 'Arizona';
      const yearbegin = Moment(packetInfo.date_begin).format('YYYY');

      const pdfBuffer = await this.pdfService
        .toBuffer(PdfTemplate.STUDENT_PACKET, {
          locals: {
            packetInfo: packetInfo,
          },
        })
        .toPromise();
      const uploadFile = await this.filesService.upload(
        pdfBuffer,
        `${region}/Student Records/${student_id}`,
        StudentRecordFileKind.STUDENT_PACKET,
        'application/pdf',
        yearbegin,
      );

      await this.studentRecordService.createStudentRecord(
        student_id,
        packetInfo.region_id,
        uploadFile.file_id,
        StudentRecordFileKind.STUDENT_PACKET,
      );

      return true;
    } catch (err) {
      return false;
    }
  }
}
