import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateReimbursementQuestionsInput } from '../dto/create-or-update-reimbursement-question.inputs';
import { ReimbursementFormType } from '../enums';
import { ReimbursementQuestion } from '../models/reimbursement-question.entity';

@Injectable()
export class ReimbursementQuestionService {
  constructor(
    @InjectRepository(ReimbursementQuestion)
    private readonly repo: Repository<ReimbursementQuestion>,
  ) {}

  async findBySchoolYearIdAndFormType(
    schoolYearId: number,
    reimbursementFormType: ReimbursementFormType,
    isDirectOrder: boolean,
  ): Promise<ReimbursementQuestion[]> {
    return await this.repo
      .createQueryBuilder('reimbursementQuestion')
      .where({
        SchoolYearId: schoolYearId,
        reimbursement_form_type: reimbursementFormType,
        is_direct_order: isDirectOrder,
      })
      .orderBy({
        'reimbursementQuestion.priority': 'ASC',
      })
      .getMany();
  }

  async save(questionInputs: CreateOrUpdateReimbursementQuestionsInput): Promise<ReimbursementQuestion[]> {
    try {
      const { questions } = questionInputs;
      const result = await this.repo.save(questions);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(remimbursement_question_id: number): Promise<boolean> {
    try {
      await this.repo.delete(remimbursement_question_id);
      return true;
    } catch (error) {
      return false;
    }
  }
}
