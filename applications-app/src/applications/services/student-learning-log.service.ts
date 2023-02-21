import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'src/paginate';
import { Repository } from 'typeorm';
import { CreateOrUpdateStudentLearningLogInput } from '../dto/create-or-update-student-learning-log.inputs';
import { StudentLearningLogArgs } from '../dto/student-learning-log.args';
import { StudentLearningLogStatus } from '../enums';
import { Assignment } from '../models/assignment.entity';
import { Classes } from '../models/classes.entity';
import { HomeroomStudent } from '../models/homeroom-student.entity';
import { StudentLearningLog } from '../models/student-learning-log.entity';

@Injectable()
export class StudentLearningLogService {
  constructor(
    @InjectRepository(StudentLearningLog)
    private readonly repository: Repository<StudentLearningLog>,
    @InjectRepository(HomeroomStudent)
    private readonly studentHomeroomRepository: Repository<HomeroomStudent>,
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(Classes)
    private readonly classRepository: Repository<Classes>,
  ) {}

  async save(studentLearningLogInput: CreateOrUpdateStudentLearningLogInput): Promise<StudentLearningLog> {
    try {
      const result = await this.repository.save({ ...studentLearningLogInput });
      return result;
    } catch (error) {
      return error;
    }
  }

  async getUngradedLearningLogs(masterId: number): Promise<number> {
    const result = await this.assignmentRepository
      .createQueryBuilder('assignments')
      .leftJoinAndSelect('assignments.StudentLearningLogs', 'studentLearningLogs')
      .where(`assignments.master_id = ${masterId}`)
      .andWhere('assignments.teacher_deadline < :teacherDeadline', { teacherDeadline: new Date() })
      .andWhere('studentLearningLogs.status IS NULL')
      .getMany();
    let ungraded = 0;
    result.map((obj) => {
      ungraded += obj.StudentLearningLogs.length;
    });
    return ungraded;
  }
  async findLearningLogsForStudent(studentLearningLogArgs: StudentLearningLogArgs): Promise<Pagination<Assignment>> {
    const { skip, take, sort, filter } = studentLearningLogArgs;
    const _sortBy = sort.split('|');

    const homeroom = await this.studentHomeroomRepository.findOne({
      school_year_id: filter?.school_year_id,
      student_id: filter?.student_id,
    });

    const classes = await this.classRepository.findOne({ class_id: homeroom?.class_id });

    const qb = this.assignmentRepository
      .createQueryBuilder('assignments')
      .leftJoinAndSelect(
        'assignments.StudentLearningLogs',
        'studentLearningLogs',
        `studentLearningLogs.SchoolYearId = ${filter.school_year_id} AND studentLearningLogs.StudentId = ${filter.student_id}`,
      )
      .where(`assignments.master_id = ${classes?.master_id}`);

    if (filter) {
      const { showAll } = filter;
      if (!showAll) {
        qb.andWhere(
          `(studentLearningLogs.status NOT IN ('${StudentLearningLogStatus.GRADED}', '${StudentLearningLogStatus.EXCUSED}', '${StudentLearningLogStatus.NANDA}') || studentLearningLogs.status IS NULL)`,
        );
      }
    }

    if (sort) {
      const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
      switch (_sortBy[0]) {
        case 'dueDate':
          qb.orderBy('assignments.due_date', sortBy);
          break;
        case 'learningLogName':
          qb.orderBy('assignments.title', sortBy);
          break;
        case 'grade':
          qb.orderBy('studentLearningLogs.grade', sortBy);
          break;
        case 'status':
          qb.orderBy('studentLearningLogs.status', sortBy);
          break;
        default:
          qb.orderBy('assignments.due_date', sortBy);
          break;
      }
    }

    const [results, total] = await qb.skip(skip).take(take).printSql().getManyAndCount();
    return new Pagination<any>({
      results,
      total,
    });
  }
}
