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
        private readonly masterRepository: Repository<Assignment>,
    ) { }

    async getAssignmentsByMasterId(assignmentArgs: AssignmentArgs): Promise<Pagination<Assignment>> {
        const { skip, take, sort, filter, search, masterId } = assignmentArgs;
        const [results, total] = await this.masterRepository.findAndCount({
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

    async save(createNewAssignmentInput: CreateNewAssignmentInput): Promise<Boolean> {
        await this.masterRepository.save({
            ...createNewAssignmentInput,
            due_date: createNewAssignmentInput.dueDateTime,
            reminder_date: createNewAssignmentInput.reminderDateTime,
            auto_grade: createNewAssignmentInput.autoGradeDateTime,
            auto_grade_email: createNewAssignmentInput.autoGradeEmail ? 1 : 0
        });
        return true;
    }

    async deleteById(assignmentId: number): Promise<Boolean> {
        await this.masterRepository.delete({ id: assignmentId });
        return true;
    }
}
