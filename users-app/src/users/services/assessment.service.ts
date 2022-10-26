import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentOptionService } from './assessment-option.service';
import { Assessment } from '../../models/assessment.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly repo: Repository<Assessment>,
    private assessmentOptionService: AssessmentOptionService,
  ) {}

  async cloneForSchoolYear(cloneSchoolYearId: number, newSchoolYearId: number) {
    const assessments = await this.repo.find({ where: { SchoolYearId: cloneSchoolYearId } });
    for (let index = 0; index < assessments.length; index++) {
      const assessment = assessments[index];
      const assessmentId = assessment.assessment_id;

      delete assessment.assessment_id;
      delete assessment.SchoolYearId;
      delete assessment.updated_at;
      delete assessment.updated_at;

      const result = await this.repo.save({
        ...assessment,
        SchoolYearId: newSchoolYearId,
      });

      await this.assessmentOptionService.cloneForAssessment(assessmentId, result.assessment_id);
    }
  }
}
