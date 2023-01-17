import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentOption } from '../../models/assessment-option.entity';

@Injectable()
export class AssessmentOptionService {
  constructor(
    @InjectRepository(AssessmentOption)
    private readonly repo: Repository<AssessmentOption>,
  ) {}

  async cloneForAssessment(cloneAssessmentId: number, newAssessmentId: number) {
    const assessmentOptions = await this.repo.find({ where: { AssessmentId: cloneAssessmentId } });
    for (let index = 0; index < assessmentOptions.length; index++) {
      const assessmentOption = assessmentOptions[index];

      delete assessmentOption.option_id;
      delete assessmentOption.AssessmentId;
      delete assessmentOption.updated_at;
      delete assessmentOption.updated_at;

      await this.repo.save({
        ...assessmentOption,
        AssessmentId: newAssessmentId,
      });
    }
  }
}
