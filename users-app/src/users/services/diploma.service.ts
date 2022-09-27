import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiplomaQuestion } from 'src/models/diploma-question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiplomaService {
  constructor(
    @InjectRepository(DiplomaQuestion)
    private readonly diplomaRepository: Repository<DiplomaQuestion>,
  ) {}

  async cloneDiplomaQuestion(cloneSchoolYearId: number, newSchoolYearId: number) {
    const cloneDiplomaQuestion = await this.diplomaRepository.findOne({ school_year_id: cloneSchoolYearId });
    if (cloneDiplomaQuestion) {
      const { title, description, grades } = cloneDiplomaQuestion;
      await this.diplomaRepository.save({
        school_year_id: newSchoolYearId,
        title,
        description,
        grades,
      });
    }
  }
}
