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
  ) {}

  async save(createOrUpdateLearningLogQuestionInput: CreateOrUpdateLearningLogQuestionInput): Promise<Boolean> {
    await this.questionRepository.save(createOrUpdateLearningLogQuestionInput);
    return true;
  }

  async get(masterId: number): Promise<LearningLogQuestion[]> {
    const result = await this.questionRepository
      .createQueryBuilder('learningLogQuestion')
      .where('learningLogQuestion.master_id = :masterId', { masterId: masterId })
      .getMany();

    return result;
  }
}
