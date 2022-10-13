import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationQuestion } from '../models/application-question.entity';
import { ApplicatinQuestionsInput } from '../dto/application-question.input';
import { NewApplicationQuestionsInput } from '../dto/new-application-questions.input';

@Injectable()
export class ApplicationQuestionsService {
  constructor(
    @InjectRepository(ApplicationQuestion)
    private readonly repo: Repository<ApplicationQuestion>,
  ) {}

  async find(input?: ApplicatinQuestionsInput): Promise<ApplicationQuestion[]> {
    if (input) {
      return await this.repo.find({
        where: {
          region_id: input.region_id,
        },
      });
    }
    return await this.repo.find();
  }

  async findExist(input?: ApplicatinQuestionsInput): Promise<ApplicationQuestion[]> {
    if (input) {
      return await this.repo.find({
        where: {
          region_id: input.region_id,
          student_question: 1,
        },
      });
    }
    return await this.repo.find();
  }

  async createOrUpdate(input: NewApplicationQuestionsInput): Promise<ApplicationQuestion> {
    return this.repo.save(input);
  }
  async deleteApplication(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }
}
