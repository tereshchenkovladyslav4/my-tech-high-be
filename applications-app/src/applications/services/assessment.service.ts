import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateAssessmentInput, UpdateAssessmentInputs } from '../dto/create-or-update-assessment.inputs';
import { Assessment } from '../models/assessment.entity';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly repo: Repository<Assessment>,
  ) {}

  async find(schoolYearId: number): Promise<Assessment[]> {
    const data = await this.repo.find({
      where: { SchoolYearId: schoolYearId },
      order: { is_archived: 'DESC', priority: 'ASC', assessment_id: 'ASC' },
    });
    return data;
  }

  async save(assessmentInput: CreateOrUpdateAssessmentInput): Promise<Assessment> {
    try {
      if (!assessmentInput.assessment_id) {
        const totalCnt = await this.repo.count({
          SchoolYearId: assessmentInput.SchoolYearId,
        });
        if (!assessmentInput.priority) assessmentInput.priority = totalCnt + 1;
      }
      const result = await this.repo.save(assessmentInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async updates(updateEventTypeInputs: UpdateAssessmentInputs): Promise<Assessment[]> {
    try {
      const { updateAssessments } = updateEventTypeInputs;
      return await this.repo.save(updateAssessments);
    } catch (error) {
      return error;
    }
  }

  async delete(assessment_id: number): Promise<Boolean> {
    try {
      await this.repo.delete(assessment_id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
