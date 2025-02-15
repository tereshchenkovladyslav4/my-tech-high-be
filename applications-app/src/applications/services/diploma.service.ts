import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaQuestion } from '../models/diploma-question.entity';
import { DiplomaQuestionInput } from '../dto/diploma-question.inputs';
import { StudentGradeLevelsService } from './student-grade-levels.service';

@Injectable()
export class DiplomaService {
  constructor(
    @InjectRepository(DiplomaQuestion)
    private readonly diplomaRepository: Repository<DiplomaQuestion>,
    private studentGradeLevelsService: StudentGradeLevelsService,
  ) {}

  async getDiplomaQuestion(diplomaQuestionInput: DiplomaQuestionInput): Promise<DiplomaQuestion> {
    const { schoolYearId } = diplomaQuestionInput;
    return await this.diplomaRepository.findOne({
      school_year_id: schoolYearId,
    });
  }

  async getDiplomaQuestionForStudent(studentId: number, schoolYearId: number): Promise<DiplomaQuestion> {
    const diplomaQuestion = await this.diplomaRepository.findOne({
      school_year_id: schoolYearId,
    });
    if (!diplomaQuestion) {
      return null;
    }

    const gradeLevel = await this.studentGradeLevelsService.findForStudentBySchoolYear(studentId, schoolYearId);
    if (!gradeLevel) return null;

    const grades = diplomaQuestion.grades;
    const gradesArray = grades?.split(',');
    if (!gradesArray || gradesArray.indexOf(gradeLevel.grade_level) === -1) {
      return null;
    }
    return diplomaQuestion;
  }

  async saveQuestion(diplomaQuestionInput: DiplomaQuestionInput): Promise<DiplomaQuestion> {
    const { id, schoolYearId, title, description } = diplomaQuestionInput;
    return await this.diplomaRepository.save({
      id,
      school_year_id: schoolYearId,
      title,
      description,
    });
  }

  async saveQuestionGrades(diplomaQuestionInput: DiplomaQuestionInput): Promise<boolean> {
    const { schoolYearId, grades, title, description } = diplomaQuestionInput;
    const question = await this.diplomaRepository.findOne({ school_year_id: schoolYearId });

    await this.diplomaRepository.save({
      id: question?.id,
      title,
      description,
      school_year_id: schoolYearId,
      grades,
    });
    return true;
  }
}
