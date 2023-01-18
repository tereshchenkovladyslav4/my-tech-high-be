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

  async clone(sourceAssignmentId: number, newAssignmentId: number): Promise<boolean> {
    const sourceQuestios = await this.questionRepository.find({ assignment_id: sourceAssignmentId });
    Promise.all([
      sourceQuestios.map(async (item) => {
        if (item.slug) {
          delete item.id;
          await this.questionRepository.save({
            ...item,
            assignment_id: newAssignmentId,
          });
        }
      }),
    ]);

    return true;
  }
}
