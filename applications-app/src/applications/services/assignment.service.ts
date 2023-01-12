import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Assignment } from '../models/assignment.entity';
import { CreateNewAssignmentInput } from '../dto/create-new-assignment.input';
import { Pagination } from 'src/paginate';
import { AssignmentArgs } from '../dto/assignment.args';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(Assignment)
        private readonly repository: Repository<Assignment>,
    ) { }

    async getAssignmentsByMasterId(assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
        const { skip, take, sort, filter, search, masterId } = assignmentArgs;
        const [results, total] = await this.repository.findAndCount({
            where: `(master_id = '${masterId}' and 
            (title like '%${search}%' or due_date like '%${search}%' or reminder_date like '%${search}%' or auto_grade like '%${search}%' or teacher_deadline like '%${search}%'))
            `,
            skip: search ? 0 : skip,
            take: take
        })
        return new Pagination<Assignment>({
            results,
            total,
        });
    }

    async getById(assignmentId: number): Promise<Assignment> {
        return await this.repository.findOne(assignmentId)
    }

    async save(createNewAssignmentInput: CreateNewAssignmentInput): Promise<Assignment> {
        const newAssignment = await this.repository.save({
            ...createNewAssignmentInput,
            due_date: createNewAssignmentInput.dueDateTime,
            reminder_date: createNewAssignmentInput.reminderDateTime,
            auto_grade: createNewAssignmentInput.autoGradeDateTime,
            auto_grade_email: createNewAssignmentInput.autoGradeEmail ? 1 : 0
        });
        return newAssignment;
    }

    async update(updateAssignmentInput: CreateNewAssignmentInput): Promise<Boolean> {
        await this.repository.update({ id: updateAssignmentInput.assignment_id }, {
            due_date: updateAssignmentInput.dueDateTime,
            reminder_date: updateAssignmentInput.reminderDateTime,
            auto_grade: updateAssignmentInput.autoGradeDateTime,
            auto_grade_email: updateAssignmentInput.autoGradeEmail ? 1 : 0,
            teacher_deadline: updateAssignmentInput.teacher_deadline,
            master_id: updateAssignmentInput.master_id,
            title: updateAssignmentInput.title,
            page_count: updateAssignmentInput.page_count
        })
        return true;
    }

    async deleteById(assignmentId: number): Promise<Boolean> {
        await this.repository.delete({ id: assignmentId });
        return true;
    }
}
