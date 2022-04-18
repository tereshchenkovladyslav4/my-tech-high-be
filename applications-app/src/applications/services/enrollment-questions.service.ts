import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentQuestionTab } from '../models/enrollment-question-tab.entity';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { NewEnrollmentQuestionsInput } from '../dto/new-enrollment-questions.inputs';
import { EnrollmentQuestions } from '../models/enrollment-questions.entity';
import { EnrollmentQuestionGroup } from '../models/enrollment-question-group.entity';
@Injectable()
export class EnrollmentQuestionsService {
  constructor(
    @InjectRepository(EnrollmentQuestions)
    private readonly repo: Repository<EnrollmentQuestions>,
  ) {}

  async findOneByParent(parent_id: number): Promise<EnrollmentQuestions[]> {
    return await this.repo
      .createQueryBuilder('questions')
      .where('questions.group_id = :parent_id', { parent_id: parent_id })
      .orderBy('questions.order', 'ASC')
      .getMany();
    // return await this.repo.find({ where: { parent_id: parent_id } });
  }

  async find(input?: EnrollmentQuestionsInput): Promise<EnrollmentQuestions[]> {
    return await this.repo.find();
  }

  async createOrUpdate(
    input: NewEnrollmentQuestionsInput,
  ): Promise<EnrollmentQuestions> {
    return this.repo.save(input);
  }
  async deleteEnrollment(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }
  async deleteByGroupId(id: number): Promise<number> {
    const questions = await this.repo.find({ group_id: id });
    await Promise.all(questions.map((el) => this.repo.delete(el.id)));
    return 1;
  }
}
