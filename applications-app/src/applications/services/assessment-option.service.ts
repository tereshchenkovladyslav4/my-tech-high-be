import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentOptionInput } from '../dto/create-or-update-assessment.inputs';
import { AssessmentOption } from '../models/assessment-option.entity';

@Injectable()
export class AssessmentOptionService {
  constructor(
    @InjectRepository(AssessmentOption)
    private readonly repo: Repository<AssessmentOption>,
  ) {}

  async save(assessmentOptionInput: AssessmentOptionInput): Promise<AssessmentOption> {
    try {
      const result = await this.repo.save(assessmentOptionInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async deleteByAssessmentId(assessment_id: number): Promise<boolean> {
    try {
      await this.repo.delete({ AssessmentId: assessment_id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
