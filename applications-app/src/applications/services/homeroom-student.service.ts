import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeroomStudent } from '../models/homeroom-student.entity';
import { HomeroomStudentInput } from '../dto/homeroom-student.inputs';

@Injectable()
export class HomeroomStudentService {
    constructor(
        @InjectRepository(HomeroomStudent)
        private readonly repository: Repository<HomeroomStudent>,
    ) { }

    async assignStudentToHomeroom(homeroomStudentInput: HomeroomStudentInput): Promise<boolean> {
        const { studentIds, school_year_id, teacher_id, auto_grade } = homeroomStudentInput;
        if (teacher_id !== -1) {
            for (let i = 0; i < studentIds.length; i++) {
                const student_id = studentIds[i];
                const existHomeroom = await this.repository.findOne({ student_id, school_year_id });
                if (existHomeroom) {
                    return false;
                }
            }
            for (let i = 0; i < studentIds.length; i++) {
                const student_id = studentIds[i];
                await this.repository.save({ student_id, school_year_id, teacher_id, auto_grade: auto_grade ? auto_grade : '' });
            }
        } else {
            for (let i = 0; i < studentIds.length; i++) {
                const student_id = studentIds[i];
                await this.repository.delete({ student_id, school_year_id });
            }
        }

        return true;
    }
}
