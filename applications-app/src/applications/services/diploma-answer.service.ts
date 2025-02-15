import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaAnswerInput } from '../dto/diploma-answer.inputs';
import { DiplomaAnswer } from '../models/diploma-answer.entity';
import { DiplomaService } from './diploma.service';

@Injectable()
export class DiplomaAnswerService {
  constructor(
    @InjectRepository(DiplomaAnswer)
    private readonly diplomaAnswerRepository: Repository<DiplomaAnswer>,
    private diplomaService: DiplomaService,
  ) {}

  async saveDiplomaAnswer(diplomaAnswerInput: DiplomaAnswerInput): Promise<DiplomaAnswer> {
    const { schoolYearId, studentId, answer } = diplomaAnswerInput;
    const diplomaAnswer = await this.diplomaAnswerRepository.findOne({
      school_year_id: schoolYearId,
      student_id: studentId,
    });

    return await this.diplomaAnswerRepository.save({
      id: diplomaAnswer?.id,
      school_year_id: schoolYearId,
      student_id: studentId,
      answer,
    });
  }

  async getDiplomaAnswer(diplomaAnswerInput: DiplomaAnswerInput): Promise<DiplomaAnswer> {
    const { schoolYearId, studentId } = diplomaAnswerInput;
    const diplomaQuestion = await this.diplomaService.getDiplomaQuestionForStudent(studentId, schoolYearId);
    if (!diplomaQuestion) return null;
    return await this.diplomaAnswerRepository.findOne({ school_year_id: schoolYearId, student_id: studentId });
  }
}
