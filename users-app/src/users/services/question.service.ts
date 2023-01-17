import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Question } from 'src/models/question.entity';

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

  async findByRegion(regionId: number, section: string): Promise<Question[]> {
    const data = await this.repo.find({
      where: { region_id: regionId, section: section },
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
}
