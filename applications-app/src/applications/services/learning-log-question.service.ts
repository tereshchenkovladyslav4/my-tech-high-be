import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningLogQuestion } from '../models/learning-log-question.entity';
import { CreateOrUpdateLearningLogQuestionInput } from '../dto/create-or-update-learninglog-question.input';

@Injectable()
export class LearningLogQuestionService {
  constructor(
    @InjectRepository(LearningLogQuestion)
    private readonly questionRepository: Repository<LearningLogQuestion>,
  ) {}

  async save(createOrUpdateLearningLogQuestionInput: CreateOrUpdateLearningLogQuestionInput[]): Promise<boolean> {
    await this.questionRepository.delete({ assignment_id: createOrUpdateLearningLogQuestionInput[0].assignment_id });
    Promise.all([
      createOrUpdateLearningLogQuestionInput.map(async (item) => {
        if (item.slug) {
          await this.questionRepository.save(item);
        }
      }),
    ]);

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
