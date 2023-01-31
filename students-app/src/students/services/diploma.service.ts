import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiplomaQuestion } from '../models/diploma-question.entity';
import { StudentGradeLevelsService } from './student-grade-levels.service';

@Injectable()
export class DiplomaService {
  constructor(
    @InjectRepository(DiplomaQuestion)
    private readonly diplomaRepository: Repository<DiplomaQuestion>,
    private studentGradeLevelsService: StudentGradeLevelsService,
  ) {}

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
}
