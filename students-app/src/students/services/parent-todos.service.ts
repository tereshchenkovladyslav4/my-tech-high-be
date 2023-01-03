import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { Student } from '../models/student.entity';
import { ToDoCategory, ToDoItem } from '../models/todo-item.entity';
import { User } from '../models/user.entity';
import { SchoolYearsService } from './schoolyears.service';
import { Application } from '../models/application.entity';
import { Packet } from '../models/packet.entity';
import { Parent } from '../models/parent.entity';
import { Person } from '../models/person.entity';
import { UserRegion } from '../models/user-region.entity';
import {
  PacketStatus,
  ScheduleStatus,
  SEMESTER_TYPE,
  StudentNotification,
  StudentStatusEnum,
  WithdrawalStatus,
} from '../enums';
import { TimezoneService } from './timezone.service';
import { Schedule } from '../models/schedule.entity';

@Injectable()
export class ParentToDosService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private schoolYearsService: SchoolYearsService,
    private timeZoneService: TimezoneService,
  ) {}

  async forUsers(user_id: number): Promise<Student[]> {
    const parent = await createQueryBuilder(Parent)
      .innerJoin(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoin(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getOne();

    return await this.studentsRepository.find({
      where: {
        parent_id: parent.parent_id,
      },
    });
  }

  async getParent(user_id: number): Promise<any> {
    return await createQueryBuilder(Parent)
      .innerJoinAndSelect(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .innerJoinAndSelect(UserRegion, 'userRegion', 'userRegion.user_id = user.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getRawOne();
  }

  async getActiveSchoolYears(region_id: number): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(region_id);

    //console.log('activeSchoolYears: ', activeSchoolYears);
    let _activeSchoolYears = [];
    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears.map(function (a) {
        return a.school_year_id;
      });
    }

    return _activeSchoolYears;
  }

  async getScheduleActiveSchoolYears(region_id: number, is_second_semester: boolean): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(region_id);
    let _activeSchoolYears = [];
    const nowDate = await this.timeZoneService.getTimezoneDate(region_id);

    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears
        .filter(
          (schoolYear) =>
            (schoolYear.schedule &&
              !is_second_semester &&
              schoolYear.schedule_builder_open <= nowDate &&
              schoolYear.schedule_builder_close >= nowDate) ||
            (schoolYear.schedule &&
              is_second_semester &&
              schoolYear.second_semester_open <= nowDate &&
              schoolYear.second_semester_close >= nowDate),
        )
        .map(function (a) {
          return a.school_year_id;
        });
    }

    return _activeSchoolYears;
  }

  async getScheduleActiveMidSchoolYears(region_id: number): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(region_id);
    let _activeSchoolYears = [];
    const nowDate = await this.timeZoneService.getTimezoneDate(region_id);

    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears
        .filter(
          (schoolYear) =>
            schoolYear.schedule &&
            schoolYear.midyear_schedule_open <= nowDate &&
            schoolYear.midyear_schedule_close >= nowDate,
        )
        .map(function (a) {
          return a.school_year_id;
        });
    }

    return _activeSchoolYears;
  }

  async submitEnrollmentPacket(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.SUBMIT_ENROLLMENT_PACKET,
      phrase: StudentNotification.SUBMIT_ENROLLMENT_PACKET,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };
    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const activeSchoolYears = await this.getActiveSchoolYears(userRegion_region_id);

    if (activeSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND application.school_year_id IN (:schoolYears)",
        { schoolYears: activeSchoolYears },
      )
      .innerJoin(
        Packet,
        'packet',
        `packet.student_id = Student.student_id AND ( packet.status <> '${PacketStatus.ACCEPTED}' AND packet.status <> '${PacketStatus.CONDITIONAL}' AND packet.status <> '${PacketStatus.SUBMITTED}' AND packet.status <> '${PacketStatus.RESUBMITTED}' AND packet.status <> '${PacketStatus.MISSING_INFO}' ) AND packet.deleted = 0`,
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
      category: ToDoCategory.SUBMIT_ENROLLMENT_PACKET,
      phrase: StudentNotification.SUBMIT_ENROLLMENT_PACKET,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: students,
    };
  }

  async resubmitEnrollmentPacket(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.RESUBMIT_ENROLLMENT_PACKET,
      phrase: StudentNotification.RESUBMIT_ENROLLMENT_PACKET,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };

    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const activeSchoolYears = await this.getActiveSchoolYears(userRegion_region_id);

    if (activeSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND application.school_year_id IN (:schoolYears)",
        { schoolYears: activeSchoolYears },
      )
      .innerJoin(
        Packet,
        'packet',
        `packet.student_id = Student.student_id AND packet.status = '${PacketStatus.MISSING_INFO}' AND packet.deleted = 0`,
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
      category: ToDoCategory.RESUBMIT_ENROLLMENT_PACKET,
      phrase: StudentNotification.RESUBMIT_ENROLLMENT_PACKET,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: students,
    };
  }

  async submitSchedule(user: User): Promise<ToDoItem> {
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.SUBMIT_SCHEDULE,
      phrase: StudentNotification.SUBMIT_SCHEDULE,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };
    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const scheduledActiveSchoolYears = await this.getScheduleActiveSchoolYears(userRegion_region_id, false);
    const scheduleActiveMidSchoolYears = await this.getScheduleActiveMidSchoolYears(userRegion_region_id);

    if (scheduledActiveSchoolYears.length == 0 && scheduleActiveMidSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .leftJoin('Student.status', 'studentStatus')
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND ((application.midyear_application = 0 OR application.midyear_application IS NULL) AND application.school_year_id IN (:schoolYears) || application.midyear_application = 1 AND application.school_year_id IN (:midSchoolYears))",
        {
          schoolYears: scheduledActiveSchoolYears.length ? scheduledActiveSchoolYears : [0],
          midSchoolYears: scheduleActiveMidSchoolYears.length ? scheduleActiveMidSchoolYears : [0],
        },
      )
      .innerJoin(
        Packet,
        'packet',
        `packet.student_id = Student.student_id AND (packet.status = '${PacketStatus.ACCEPTED}' OR packet.status = '${PacketStatus.CONDITIONAL}') AND packet.deleted = 0`,
      )
      .leftJoinAndSelect(
        Schedule,
        'schedule',
        `schedule.StudentId = application.student_id AND (schedule.is_second_semester = 0 OR schedule.is_second_semester IS NULL) AND schedule.SchoolYearId = application.school_year_id AND schedule.status <> '${ScheduleStatus.DRAFT}' AND schedule.status <> '${ScheduleStatus.NOT_SUBMITTED}'`,
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .andWhere(`studentStatus.status <> ${StudentStatusEnum.WITHDRAWN}`)
      .andWhere('schedule.schedule_id IS NULL')
      .orderBy('application.application_id', 'DESC')
      .printSql()
      .getMany();

    defaultResponse.students = students;

    return defaultResponse;
  }

  async submitSecondSemesterSchedule(user: User): Promise<ToDoItem> {
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.SUBMIT_SECOND_SEMESTER_SCHEDULE,
      phrase: StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };
    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const scheduledActiveSchoolYears = await this.getScheduleActiveSchoolYears(userRegion_region_id, true);
    const scheduleActiveMidSchoolYears = await this.getScheduleActiveMidSchoolYears(userRegion_region_id);

    if (scheduledActiveSchoolYears.length == 0 && scheduleActiveMidSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .leftJoin('Student.status', 'studentStatus')
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND ((application.midyear_application = 0 OR application.midyear_application IS NULL) AND application.school_year_id IN (:schoolYears) || application.midyear_application = 1 AND application.school_year_id IN (:midSchoolYears))",
        {
          schoolYears: scheduledActiveSchoolYears.length ? scheduledActiveSchoolYears : [0],
          midSchoolYears: scheduleActiveMidSchoolYears.length ? scheduleActiveMidSchoolYears : [0],
        },
      )
      .innerJoin(
        Packet,
        'packet',
        "packet.student_id = `Student`.student_id AND packet.status = 'Accepted' AND packet.deleted = 0",
      )
      .leftJoinAndSelect(
        Schedule,
        'schedule',
        `schedule.StudentId = application.student_id AND schedule.SchoolYearId = application.school_year_id AND schedule.is_second_semester = 1  AND schedule.status <> '${ScheduleStatus.DRAFT}' AND schedule.status <> '${ScheduleStatus.NOT_SUBMITTED}'`,
      )
      .innerJoin(
        Schedule,
        'regularSchedule',
        `regularSchedule.StudentId = application.student_id AND regularSchedule.SchoolYearId = application.school_year_id AND (regularSchedule.is_second_semester = 0 OR regularSchedule.is_second_semester IS NULL)  AND regularSchedule.status = '${ScheduleStatus.ACCEPTED}'`,
      )
      .leftJoin('regularSchedule.SchedulePeriods', 'SchedulePeriods')
      .leftJoin('SchedulePeriods.Period', 'Period', `Period.semester <> '${SEMESTER_TYPE.NONE}'`)
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .andWhere(`studentStatus.status <> ${StudentStatusEnum.WITHDRAWN}`)
      .andWhere('(schedule.schedule_id IS NULL AND regularSchedule.schedule_id IS NOT NULL)')
      .andWhere('Period.id IS NOT NULL')
      .orderBy('application.application_id', 'DESC')
      .printSql()
      .getMany();

    defaultResponse.students = students;

    return defaultResponse;
  }

  async resubmitSchedule(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.RESUBMIT_SCHEDULE,
      phrase: StudentNotification.RESUBMIT_SCHEDULE,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };
    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const scheduledActiveSchoolYears = await this.getScheduleActiveSchoolYears(userRegion_region_id, false);
    const scheduleActiveMidSchoolYears = await this.getScheduleActiveMidSchoolYears(userRegion_region_id);

    if (scheduledActiveSchoolYears.length == 0 && scheduleActiveMidSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .leftJoin('Student.status', 'studentStatus')
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND ((application.midyear_application = 0 OR application.midyear_application IS NULL) AND application.school_year_id IN (:schoolYears) || application.midyear_application = 1 AND application.school_year_id IN (:midSchoolYears))",
        {
          schoolYears: scheduledActiveSchoolYears.length ? scheduledActiveSchoolYears : [0],
          midSchoolYears: scheduleActiveMidSchoolYears.length ? scheduleActiveMidSchoolYears : [0],
        },
      )
      .innerJoin(
        Packet,
        'packet',
        "packet.student_id = `Student`.student_id AND packet.status = 'Accepted' AND packet.deleted = 0",
      )
      .leftJoinAndSelect(
        Schedule,
        'schedule',
        `schedule.StudentId = application.student_id AND (schedule.is_second_semester = 0 OR schedule.is_second_semester IS NULL) AND schedule.SchoolYearId = application.school_year_id AND schedule.status = '${ScheduleStatus.UPDATES_REQUIRED}'`,
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .andWhere(`studentStatus.status <> ${StudentStatusEnum.WITHDRAWN}`)
      .andWhere('schedule.schedule_id IS NOT NULL')
      .orderBy('application.application_id', 'DESC')
      .printSql()
      .getMany();

    defaultResponse.students = students;

    return defaultResponse;
  }

  async resubmitSecondSemesterSchedule(user: User): Promise<ToDoItem> {
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.RESUBMIT_SECOND_SEMESTER_SCHEDULE,
      phrase: StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };
    if (!parent) {
      return defaultResponse;
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const scheduledActiveSchoolYears = await this.getScheduleActiveSchoolYears(userRegion_region_id, true);
    const scheduleActiveMidSchoolYears = await this.getScheduleActiveMidSchoolYears(userRegion_region_id);

    if (scheduledActiveSchoolYears.length == 0 && scheduleActiveMidSchoolYears.length == 0) {
      return defaultResponse;
    }

    const students = await createQueryBuilder(Student)
      .leftJoin('Student.status', 'studentStatus')
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND ((application.midyear_application = 0 OR application.midyear_application IS NULL) AND application.school_year_id IN (:schoolYears) || application.midyear_application = 1 AND application.school_year_id IN (:midSchoolYears))",
        {
          schoolYears: scheduledActiveSchoolYears.length ? scheduledActiveSchoolYears : [0],
          midSchoolYears: scheduleActiveMidSchoolYears.length ? scheduleActiveMidSchoolYears : [0],
        },
      )
      .innerJoin(
        Packet,
        'packet',
        "packet.student_id = `Student`.student_id AND packet.status = 'Accepted' AND packet.deleted = 0",
      )
      .leftJoinAndSelect(
        Schedule,
        'schedule',
        `schedule.StudentId = application.student_id AND schedule.is_second_semester = 1 AND schedule.SchoolYearId = application.school_year_id AND schedule.status = '${ScheduleStatus.UPDATES_REQUIRED}'`,
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .andWhere(`studentStatus.status <> ${StudentStatusEnum.WITHDRAWN}`)
      .andWhere('schedule.schedule_id IS NOT NULL')
      .orderBy('application.application_id', 'DESC')
      .printSql()
      .getMany();

    defaultResponse.students = students;

    return defaultResponse;
  }

  async resubmitReimbursement(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.RESUBMIT_REIMBURSEMENT,
      phrase: StudentNotification.RESUBMIT_REIMBURSEMENT,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async resubmitDirectOrder(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.RESUBMIT_DIRECT_ORDER,
      phrase: StudentNotification.RESUBMIT_DIRECT_ORDER,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async testingPreference(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.TESTING_PREFERNCE,
      phrase: StudentNotification.TESTING_PREFERNCE,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async missingLearningLog(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.MISSING_LEARNING_LOG,
      phrase: StudentNotification.MISSING_LEARNING_LOG,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // no
      students: students,
    };
  }

  async resubmitLearningLog(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.RESUBMIT_LEARNING_LOG,
      phrase: StudentNotification.RESUBMIT_LEARNING_LOG,
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // no
      students: students,
    };
  }

  async intentToReEnroll(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.INTENT_TO_RE_ENROLL,
      phrase: StudentNotification.INTENT_TO_RE_ENROLL,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async requestHomeroomResources(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.REQUEST_HOMEROOM_RESOURCES,
      phrase: StudentNotification.REQUEST_HOMEROOM_RESOURCES,
      button: 'Request Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async submitWithdraws(user: User): Promise<ToDoItem> {
    // Fetch students to be withdrawn
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.SUBMIT_WITHDRAW,
      phrase: StudentNotification.SUBMIT_WITHDRAW,
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: [],
    };

    if (!parent) {
      return defaultResponse;
    }

    const { Parent_parent_id } = parent;

    defaultResponse.students = await this.studentsRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.StudentWithdrawals', 'withdrawal')
      .leftJoin('student.status', 'studentStatus')
      .where(`student.parent_id=${Parent_parent_id}`)
      .andWhere(`studentStatus.status=${StudentStatusEnum.WITHDRAWN}`)
      .andWhere(`withdrawal.status='${WithdrawalStatus.NOTIFIED}'`)
      .getMany();
    return defaultResponse;
  }
}
