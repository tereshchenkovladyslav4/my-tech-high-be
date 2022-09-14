import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaQuestion } from '../models/diploma-question.entity';
import { DiplomaQuestionInput } from '../dto/diploma-question.inputs';
@Injectable()
export class DiplomaService {
    constructor(
        @InjectRepository(DiplomaQuestion)
        private readonly diplomaRepository: Repository<DiplomaQuestion>,
    ) { }

    async getDiplomaQuestion(diplomaQuestionInput: DiplomaQuestionInput): Promise<DiplomaQuestion> {
        const { schoolYearId } = diplomaQuestionInput;
        return await this.diplomaRepository.findOne({
            school_year_id: schoolYearId
        });
    }

    async saveQuestion(diplomaQuestionInput: DiplomaQuestionInput): Promise<DiplomaQuestion> {
        const { id, schoolYearId, title, description } = diplomaQuestionInput;
        return await this.diplomaRepository.save({
            id,
            school_year_id: schoolYearId,
            title,
            description
        });
    }

    async saveQuestionGrades(diplomaQuestionInput: DiplomaQuestionInput): Promise<Boolean> {
        const { schoolYearId, grades, title, description } = diplomaQuestionInput;
        const question = await this.diplomaRepository.findOne({ school_year_id: schoolYearId });

        await this.diplomaRepository.save({
            id: question?.id,
            title,
            description,
            school_year_id: schoolYearId,
            grades
        })
        return true;
    }
}
