import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnrollmentQuestions } from 'src/models/enrollment-questions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EnrollmentQuestionService {
  constructor(
    @InjectRepository(EnrollmentQuestions)
    private readonly repo: Repository<EnrollmentQuestions>,
  ) {}

  async cloneForSchoolYear(previoudGroupId: number, newGroupId: number): Promise<boolean> {
    const previousQuestions = await this.repo.find({ group_id: previoudGroupId });
    for (let i = 0; i < previousQuestions.length; i++) {
      const item = previousQuestions[i];
      delete item.id;
      await this.repo.save({
        ...item,
        group_id: newGroupId,
      });
    }
    return true;
  }
}
