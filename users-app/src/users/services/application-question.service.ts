import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApplicationQuestion } from 'src/models/application-question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ApplicationQuestionService {
  constructor(
    @InjectRepository(ApplicationQuestion)
    private readonly repo: Repository<ApplicationQuestion>,
  ) {}

  async cloneForSchoolYear(cloneSchoolYearId: number, newSchoolYearId: number): Promise<boolean> {
    const previousQuestions = await this.repo.find({ school_year_id: cloneSchoolYearId });
    for (let i = 0; i < previousQuestions.length; i++) {
      const item = previousQuestions[i];
      delete item.id;
      await this.repo.save({
        ...item,
        school_year_id: newSchoolYearId,
      });
    }
    return true;
  }
}
