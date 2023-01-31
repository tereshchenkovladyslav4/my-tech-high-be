import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaAnswer } from '../models/diploma-answer.entity';
import { DiplomaService } from './diploma.service';

@Injectable()
export class DiplomaAnswerService {
  constructor(
    @InjectRepository(DiplomaAnswer)
    private readonly diplomaAnswerRepository: Repository<DiplomaAnswer>,
    private diplomaService: DiplomaService,
  ) {}

  async getDiplomaAnswer(studentId: number, schoolYearId: number): Promise<DiplomaAnswer> {
    const diplomaQuestion = await this.diplomaService.getDiplomaQuestionForStudent(studentId, schoolYearId);
    if (!diplomaQuestion) return null;
    return await this.diplomaAnswerRepository.findOne({ school_year_id: schoolYearId, student_id: studentId });
  }
}
