import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder, Brackets } from 'typeorm';
import { Student } from '../models/student.entity';
import { ToDoItem } from '../models/todo-item.entity';
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

  async submitEnrollmentPacket(user: User): Promise<ToDoItem> {
    // Fetch students for Enrollment Packets
    const parent = await this.getParent(user.user_id);

    if (!parent) {
      return {
        phrase: 'Submit Enrollment Packet',
        button: 'Submit Now',
        icon: '',
        dashboard: 1, // yes
        homeroom: 1, // yes
        students: [],
      };
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const schoolYear = await this.schoolYearsService.getCurrent(
      userRegion_region_id,
    );
    const students = await createQueryBuilder(Student)
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND application.school_year_id = :schoolYear",
        { schoolYear: schoolYear.school_year_id },
      )
      .innerJoin(
        Packet,
        'packet',
        "packet.student_id = `Student`.student_id AND ( packet.status <> 'Accepted' AND packet.status <> 'Submitted' ) AND packet.deleted = 0",
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
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

    if (!parent) {
      return {
        phrase: 'Submit Enrollment Packet',
        button: 'Submit Now',
        icon: '',
        dashboard: 1, // yes
        homeroom: 1, // yes
        students: [],
      };
    }

    const { userRegion_region_id, Parent_parent_id } = parent;
    const schoolYear = await this.schoolYearsService.getCurrent(
      userRegion_region_id,
    );
    const students = await createQueryBuilder(Student)
      .innerJoin(
        Application,
        'application',
        "application.student_id = `Student`.student_id AND application.status = 'Accepted' AND application.school_year_id = :schoolYear",
        { schoolYear: schoolYear.school_year_id },
      )
      .innerJoin(
        Packet,
        'packet',
        "packet.student_id = `Student`.student_id AND packet.status = 'Submitted' AND packet.deleted = 0",
      )
      .where('`Student`.parent_id = :parent', { parent: Parent_parent_id })
      .orderBy('application.application_id', 'DESC')
      .orderBy('packet.packet_id', 'DESC')
      .printSql()
      .getMany();

    return {
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
      phrase: 'Request Homeroom Resources',
      button: 'Request Now',
      icon: '',
      dashboard: 1, // yes
      homeroom: 0, // no
      students: students,
    };
  }
}
