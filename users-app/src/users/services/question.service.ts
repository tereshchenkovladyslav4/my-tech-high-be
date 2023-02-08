import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Question } from 'src/models/question.entity';
import { WithdrawQuestionInput } from '../dto/withdraw-question.input';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    const data = await this.repo.find({ where: { flag: Not(2) } });
    return data;
  }

  async findByRegion(withdrawQuestionInput: WithdrawQuestionInput): Promise<Question[]> {
    const data = await this.repo.find({
      where: {
        school_year_id: withdrawQuestionInput.school_year_id,
        mid_year: withdrawQuestionInput.mid_year,
        section: withdrawQuestionInput.section,
      },
      order: { sequence: 'ASC' },
    });
    return data;
  }

  async findById(id: number): Promise<Question> {
    const data = await this.repo.findOne(id);
    return data;
  }

  async save(input: Question): Promise<Question> {
    return this.repo.save(input);
  }

  async delete(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }

  async clone(oldSchoolYearId: number, newSchoolYearId: number): Promise<boolean> {
    const oldQuestions = await this.repo.find({ school_year_id: oldSchoolYearId });
    for (let i = 0; i < oldQuestions.length; i++) {
      const item = oldQuestions[i];
      delete item['id'];
      await this.repo.save({
        ...item,
        school_year_id: newSchoolYearId,
      });
    }
    return true;
  }
}
