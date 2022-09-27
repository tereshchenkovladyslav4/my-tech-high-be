import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaAnswerInput } from '../dto/diploma-answer.inputs';
import { DiplomaAnswer } from '../models/diploma-answer.entity';
@Injectable()
export class DiplomaAnswerService {
  constructor(
    @InjectRepository(DiplomaAnswer)
    private readonly diplomaAnswerRepository: Repository<DiplomaAnswer>,
  ) {}

  async saveDiplomaAnswer(diplomaAnswerInput: DiplomaAnswerInput): Promise<DiplomaAnswer> {
    const { schoolYearId, studentId, answer } = diplomaAnswerInput;
    const diplomaAnswer = await this.diplomaAnswerRepository.findOne({
      school_year_id: schoolYearId,
      student_id: studentId,
    });

    const newDiplomaAnswer = await this.diplomaAnswerRepository.save({
      id: diplomaAnswer?.id,
      school_year_id: schoolYearId,
      student_id: studentId,
      answer,
    });
    return newDiplomaAnswer;
  }

  async getDiplomaAnswer(diplomaAnswerInput: DiplomaAnswerInput): Promise<DiplomaAnswer> {
    const { schoolYearId, studentId } = diplomaAnswerInput;
    const result = await this.diplomaAnswerRepository.findOne({ school_year_id: schoolYearId, student_id: studentId });
    return result;
  }
}
