import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentQuestionTab } from '../models/enrollment-question-tab.entity';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { NewEnrollmentQuestionTabInput } from '../dto/new-enrollment-question-tab.inputs';
import { EnrollmentQuestionGroupService } from './enrollment-question-group.service';
@Injectable()
export class EnrollmentQuestionTabService {
  constructor(
    @InjectRepository(EnrollmentQuestionTab)
    private readonly repo: Repository<EnrollmentQuestionTab>,
    private enrollmentQuestionGroupService: EnrollmentQuestionGroupService,
  ) {}

  async find(
    input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionTab[]> {
    if (input) {
      return await this.repo.find({
        where: {
          region_id: input.region_id,
        },
      });
    }
    return await this.repo.find();
  }

  async findByActive(
    input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionTab[]> {
    if (input) {
      return await this.repo.find({
        where: {
          region_id: input.region_id,
          is_active: 1,
        },
      });
    }
    return await this.repo.find();
  }

  async createOrUpdate(
    input: NewEnrollmentQuestionTabInput,
  ): Promise<EnrollmentQuestionTab> {
    const { id, is_active, tab_name, region_id, groups } = input;
    const tabData = await this.repo.save({
      id,
      is_active,
      tab_name,
      region_id,
    });
    Promise.all(
      groups.map(async el =>
        await this.enrollmentQuestionGroupService.createOrUpdate({
          ...el,
          tab_id: tabData.id,
        }),
      ),
    );
    return tabData;
  }
  async deleteEnrollment(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }
}
