import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateAssessmentInput, UpdateAssessmentInputs } from '../dto/create-or-update-assessment.inputs';
import { Assessment } from '../models/assessment.entity';
import { AssessmentOptionService } from './assessment-option.service';

@Injectable()
export class AssessmentService {
  constructor(
    @InjectRepository(Assessment)
    private readonly repo: Repository<Assessment>,
    private assessmentOptionService: AssessmentOptionService,
  ) { }

  async find(schoolYearId: number): Promise<Assessment[]> {
    const data = await this.repo.find({
      where: { SchoolYearId: schoolYearId },
      relations: ['Options', 'SchoolYear'],
      order: { is_archived: 'DESC', priority: 'ASC', assessment_id: 'ASC' },
    });
    return data;
  }

  async save(createOrUpdateAssessmentInput: CreateOrUpdateAssessmentInput): Promise<Assessment> {
    try {
      if (!createOrUpdateAssessmentInput?.assessment?.assessment_id) {
        const totalCnt = await this.repo.count({
          SchoolYearId: createOrUpdateAssessmentInput?.assessment?.SchoolYearId,
        });
        if (!createOrUpdateAssessmentInput?.assessment?.priority)
          createOrUpdateAssessmentInput.assessment.priority = totalCnt + 1;
      }
      const result = await this.repo.save(createOrUpdateAssessmentInput.assessment);
      if (result?.assessment_id && createOrUpdateAssessmentInput?.options) {
        await this.assessmentOptionService.deleteByAssessmentId(result?.assessment_id);
        createOrUpdateAssessmentInput?.options?.map(async (option) => {
          await this.assessmentOptionService.save({ ...option, AssessmentId: result?.assessment_id });
        });
      }
      return result;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async updates(updateEventTypeInputs: UpdateAssessmentInputs): Promise<Assessment[]> {
    try {
      const { updateAssessments } = updateEventTypeInputs;
      return await this.repo.save(updateAssessments);
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async delete(assessment_id: number): Promise<boolean> {
    try {
      await this.assessmentOptionService.deleteByAssessmentId(assessment_id);
      await this.repo.delete(assessment_id);
      return true;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }
}
