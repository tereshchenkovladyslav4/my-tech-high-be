import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { LearningLogQuestion } from '../models/learning-log-question.entity';
import { CreateOrUpdateLearningLogQuestionInput } from '../dto/create-or-update-learninglog-question.input';

@Injectable()
export class LearningLogQuestionService {
  constructor(
    @InjectRepository(LearningLogQuestion)
    private readonly questionRepository: Repository<LearningLogQuestion>,
  ) { }

  async save(createOrUpdateLearningLogQuestionInput: CreateOrUpdateLearningLogQuestionInput[]): Promise<Boolean> {
    await this.questionRepository.delete({ assignment_id: createOrUpdateLearningLogQuestionInput[0].assignment_id })
    Promise.all([
      createOrUpdateLearningLogQuestionInput.map(async (item) => {
        let validationList = [];
        if (item?.validations) {
          validationList = JSON.parse(item?.validations)
        }
        if (item.slug) {
          await this.questionRepository.save({
            ...item,
            required: validationList.includes('required'),
            can_upload: validationList.includes('upload'),
            grade_specific: validationList.includes('grade_question'),
          })
        }
      })
    ])

    return true;
  }

  async get(assignmentId: number): Promise<LearningLogQuestion[]> {
    const result = await this.questionRepository
      .createQueryBuilder('learningLogQuestion')
      .where('learningLogQuestion.assignment_id = :assignmentId', { assignmentId: assignmentId })
      .getMany();

    return result;
  }
}
