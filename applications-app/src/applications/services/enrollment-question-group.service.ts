import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { NewEnrollmentQuestionGroupInput } from '../dto/new-enrollment-question-group.inputs';
import { EnrollmentQuestionGroup } from '../models/enrollment-question-group.entity';
import { EnrollmentQuestions } from '../models/enrollment-questions.entity';
import { EnrollmentQuestionsService } from './enrollment-questions.service';
@Injectable()
export class EnrollmentQuestionGroupService {
  constructor(
    @InjectRepository(EnrollmentQuestionGroup)
    private readonly repo: Repository<EnrollmentQuestionGroup>,
    private enrollmentQuestionsService: EnrollmentQuestionsService,
  ) {}

  async findOneByParent(parent_id: number): Promise<EnrollmentQuestionGroup[]> {
    return await this.repo
      .createQueryBuilder('groups')
      .where('groups.tab_id = :parent_id', { parent_id: parent_id })
      .orderBy('groups.order', 'ASC')
      .getMany();
  }

  async find(
    input?: EnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestionGroup[]> {
    return await this.repo.find();
  }

  async createOrUpdate(
    input: NewEnrollmentQuestionGroupInput,
  ): Promise<EnrollmentQuestionGroup> {
    const { id, order, group_name, tab_id, questions } = input;

    const groupData = await this.repo.save({ id, order, group_name, tab_id });
    await Promise.all(
      questions.map((el) =>
        this.enrollmentQuestionsService.createOrUpdate({
          ...el,
          group_id: groupData.id,
        }),
      ),
    );
    return groupData;
  }
  async deleteEnrollment(id: number): Promise<number> {
    await this.enrollmentQuestionsService.deleteByGroupId(id);
    const res = await this.repo.delete(id);

    return res.affected;
  }
}
