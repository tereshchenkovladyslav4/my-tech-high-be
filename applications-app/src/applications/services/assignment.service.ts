import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Assignment } from '../models/assignment.entity';
import { CreateNewAssignmentInput } from '../dto/create-new-assignment.input';
import { Pagination } from 'src/paginate';
import { AssignmentArgs } from '../dto/assignment.args';
import { LearningLogQuestionService } from './learning-log-question.service';
import { TeacherAssignmentArgs } from '../dto/teacher-assignment.args';
import { AssignmentFilterStatus, StudentLearningLogStatus } from '../enums';
import { Classes } from '../models/classes.entity';
import moment from 'moment';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectRepository(Assignment)
    private readonly repository: Repository<Assignment>,
    private learningLogQuestionService: LearningLogQuestionService,
    @InjectRepository(Classes)
    private readonly classesRepository: Repository<Classes>,
  ) {}

  async getAssignmentsByMasterId(assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
    const { skip, take, search, masterId } = assignmentArgs;
    const [results, total] = await this.repository.findAndCount({
      where: `(master_id = '${masterId}' and 
            (title like '%${search}%' or due_date like '%${search}%' or reminder_date like '%${search}%' or auto_grade like '%${search}%' or teacher_deadline like '%${search}%'))
            `,
      skip: search ? 0 : skip,
      take: take,
    });
    return new Pagination<Assignment>({
      results,
      total,
    });
  }

  async getById(assignmentId: number): Promise<Assignment> {
    return await this.repository.findOne(assignmentId);
  }

  async save(createNewAssignmentInput: CreateNewAssignmentInput): Promise<Assignment> {
    const newAssignment = await this.repository.save({
      ...createNewAssignmentInput,
      due_date: createNewAssignmentInput.dueDateTime,
      reminder_date: createNewAssignmentInput.reminderDateTime,
      auto_grade: createNewAssignmentInput.autoGradeDateTime,
      auto_grade_email: createNewAssignmentInput.autoGradeEmail ? 1 : 0,
    });
    return newAssignment;
  }

  async update(updateAssignmentInput: CreateNewAssignmentInput): Promise<boolean> {
    await this.repository.update(
      { id: updateAssignmentInput.assignment_id },
      {
        due_date: updateAssignmentInput.dueDateTime,
        reminder_date: updateAssignmentInput.reminderDateTime,
        auto_grade: updateAssignmentInput.autoGradeDateTime,
        auto_grade_email: updateAssignmentInput.autoGradeEmail ? 1 : 0,
        teacher_deadline: updateAssignmentInput.teacher_deadline,
        master_id: updateAssignmentInput.master_id,
        title: updateAssignmentInput.title,
        page_count: updateAssignmentInput.page_count,
      },
    );
    return true;
  }

  async clone(cloneAssignmentInput: CreateNewAssignmentInput): Promise<boolean> {
    const newAssignment = await this.repository.save({
      teacher_deadline: cloneAssignmentInput.teacher_deadline,
      title: cloneAssignmentInput.title,
      master_id: cloneAssignmentInput.master_id,
      due_date: cloneAssignmentInput.dueDateTime,
      reminder_date: cloneAssignmentInput.reminderDateTime,
      auto_grade: cloneAssignmentInput.autoGradeDateTime,
      auto_grade_email: cloneAssignmentInput.autoGradeEmail ? 1 : 0,
    });
    await this.learningLogQuestionService.clone(cloneAssignmentInput.assignment_id, newAssignment.id);
    return true;
  }

  async deleteById(assignmentId: number): Promise<boolean> {
    await this.repository.delete({ id: assignmentId });
    return true;
  }

  async findTeacherAssignment(teacherAssignmentArgs: TeacherAssignmentArgs): Promise<Pagination<Assignment>> {
    const { skip, take, filter, search } = teacherAssignmentArgs;
    try {
      const classResult = await this.classesRepository.findOne({ where: { class_id: Number(filter.classId) } });
      const qb = this.repository
        .createQueryBuilder('assignments')
        .leftJoinAndSelect('assignments.StudentLearningLogs', 'studentLearningLogs')
        .where(`assignments.master_id = ${classResult.master_id}`)
        .orderBy('assignments.due_date', 'DESC');

      if (filter.status === AssignmentFilterStatus.UNGRADED) {
        qb.andWhere(
          `(studentLearningLogs.status NOT IN ('${
            StudentLearningLogStatus.GRADED
          }') || studentLearningLogs.status IN ('${
            (StudentLearningLogStatus.SUBMITTED, StudentLearningLogStatus.RESUBMITTED)
          }'))`,
        );
      }
      if (search) {
        qb.andWhere(
          new Brackets((sub) => {
            sub
              .orWhere('assignments.title like :text', {
                text: `%${search}%`,
              })
              .orWhere('assignments.due_date like :text', {
                text: `%${search}%`,
              })
              .orWhere('assignments.teacher_deadline like :text', {
                text: `%${search}%`,
              });
          }),
        );
      }
      const [results, total] = await qb.skip(skip).take(take).printSql().getManyAndCount();
      return new Pagination<any>({
        results,
        total,
      });
    } catch (error) {
      return error;
    }
  }
}
