import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, getConnection } from 'typeorm';
import { Student } from '../models/student.entity';
import { ToDoCategory, ToDoItem } from '../models/todo-item.entity';
import { User } from '../models/user.entity';
import { ParentToDo } from '../models/parent-todo.entity';
import { SchoolYearsService } from './schoolyears.service';
import { ApplicationsService } from './applications.service';
import { PacketsService } from './packets.service';
import { Application } from '../models/application.entity';
import { Packet } from '../models/packet.entity';
import { Parent } from '../models/parent.entity';
import { Person } from '../models/person.entity';
import { UserRegion } from '../models/user-region.entity';
import { SchoolYear } from '../models/schoolyear.entity';
import { WithdrawalStatus } from '../enums';

@Injectable()
export class ParentToDosService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    private schoolYearsService: SchoolYearsService,
    private applicationsService: ApplicationsService,
    private packetsService: PacketsService,
  ) {}

  async forUsers(user_id: number): Promise<Student[]> {
    const parent = await createQueryBuilder(Parent)
      .innerJoin(Person, 'person', 'person.person_id = `Parent`.person_id')
      .innerJoin(User, 'user', 'user.user_id = person.user_id')
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getOne();

    const students = await this.studentsRepository.find({
      where: {
        parent_id: parent.parent_id,
      },
    });

    return students;
  }

  async getParent(user_id: number): Promise<any> {
    return await createQueryBuilder(Parent)
      .innerJoinAndSelect(
        Person,
        'person',
        'person.person_id = `Parent`.person_id',
      )
      .innerJoinAndSelect(User, 'user', 'user.user_id = person.user_id')
      .innerJoinAndSelect(
        UserRegion,
        'userRegion',
        'userRegion.user_id = user.user_id',
      )
      .where('user.user_id = :userId', { userId: user_id })
      .printSql()
      .getRawOne();
  }

  async getActiveSchoolYears(region_id: number): Promise<any> {
    const activeSchoolYears = await this.schoolYearsService.getAllActive(
      region_id,
    );

    //console.log('activeSchoolYears: ', activeSchoolYears);
    let _activeSchoolYears = [];
    if (activeSchoolYears) {
      _activeSchoolYears = activeSchoolYears.map(function (a) {
        return a.school_year_id;
      });
    }
    console.log('ActiveSchoolYears: ', _activeSchoolYears);

    return _activeSchoolYears;
  }

  async submitEnrollmentPacket(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const parent = await this.getParent(user.user_id);
    const defaultResponse = {
      category: ToDoCategory.SUBMIT_ENROLLMENT_PACKET,
      phrase: 'Submit Enrollment Packet',
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
    const activeSchoolYears = await this.getActiveSchoolYears(
      userRegion_region_id,
    );

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
        "packet.student_id = `Student`.student_id AND ( packet.status <> 'Accepted' AND packet.status <> 'Submitted' AND packet.status <> 'Resubmitted' AND packet.status <> 'Missing Info' ) AND packet.deleted = 0",
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
      category: ToDoCategory.SUBMIT_ENROLLMENT_PACKET,
      phrase: 'Submit Enrollment Packet',
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
      phrase: 'Resubmit Enrollment Packet',
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
    const activeSchoolYears = await this.getActiveSchoolYears(
      userRegion_region_id,
    );

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
        "packet.student_id = `Student`.student_id AND packet.status = 'Missing Info' AND packet.deleted = 0",
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
      category: ToDoCategory.RESUBMIT_ENROLLMENT_PACKET,
      phrase: 'Resubmit Enrollment Packet',
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: students,
    };
  }

  async submitSchedule(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];

    return {
      category: ToDoCategory.SUBMIT_SCHEDULE,
      phrase: 'Submit Schedule',
      button: 'Submit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: students,
    };
  }

  async resubmitSchedule(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.RESUBMIT_SCHEDULE,
      phrase: 'Resubmit Schedule',
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // yes
      students: students,
    };
  }

  async resubmitReimbursement(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.RESUBMIT_REIMBURSEMENT,
      phrase: 'Resubmit Reimbursement',
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
      phrase: 'Resubmit Direct Order',
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }

  async testingPrefernce(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.TESTING_PREFERNCE,
      phrase: 'Testing Prefernce',
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
      phrase: 'Missing Learning Log',
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
      phrase: 'Resubmit Learning Log',
      button: 'Resubmit Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 1, // no
      students: students,
    };
  }

  async intentToReenroll(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const students = [];
    return {
      category: ToDoCategory.INTENT_TO_RE_ENROLL,
      phrase: 'Intent to Re-enroll',
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
      phrase: 'Request Homeroom Resources',
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
      phrase: 'Submit Withdraw',
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
      .andWhere(`studentStatus.status=${2}`)
      .andWhere(`withdrawal.status='${WithdrawalStatus.NOTIFIED}'`)
      .getMany();
    return defaultResponse;
  }
}
