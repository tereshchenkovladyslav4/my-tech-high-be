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
          school_year_id: input.school_year_id,
          mid_year: input.mid_year ? 1 : 0,
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
          school_year_id: input.school_year_id,
          mid_year: input.mid_year ? 1 : 0,
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
