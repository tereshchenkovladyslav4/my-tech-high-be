import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { EnrollmentQuestionsInput } from '../dto/enrollment-question.input';
import { NewEnrollmentQuestionsInput } from '../dto/new-enrollment-questions.inputs';
import { EnrollmentQuestions } from '../models/enrollment-questions.entity';

@Injectable()
export class EnrollmentQuestionsService {
  constructor(
    @InjectRepository(EnrollmentQuestions)
    private readonly repo: Repository<EnrollmentQuestions>,
  ) {}

  async findOneByParent(parent_id: number): Promise<EnrollmentQuestions[]> {
    return await this.repo
      .createQueryBuilder('questions')
      .where('questions.group_id = :parent_id', { parent_id: parent_id })
      .orderBy('questions.order', 'ASC')
      .getMany();
    // return await this.repo.find({ where: { parent_id: parent_id } });
  }

  async find(input?: EnrollmentQuestionsInput): Promise<EnrollmentQuestions[]> {
    return await this.repo.find();
  }

  async createOrUpdate(input: NewEnrollmentQuestionsInput): Promise<EnrollmentQuestions> {
    return this.repo.save(input);
  }
  async deleteEnrollment(id: number): Promise<number> {
    const res = await this.repo.delete(id);
    return res.affected;
  }
  async deleteByGroupId(id: number): Promise<number> {
    const questions = await this.repo.find({ group_id: id });
    await Promise.all(questions.map((el) => this.repo.delete(el.id)));
    return 1;
  }
  async findEnrollmentQuesBySlugAndRegion(region_id: number, slug: string): Promise<Array<EnrollmentQuestions>> {
    if (region_id && slug) {
      const queryRunner = await getConnection().createQueryRunner();
      const enrollmentQuestion = await queryRunner.query(
        `SELECT
          * FROM infocenter.mth_enrollment_question_tab AS meqt
          LEFT JOIN infocenter.mth_enrollment_question_group AS meqg1 ON (meqt.id = meqg1.tab_id)
          LEFT JOIN infocenter.mth_enrollment_questions AS meq ON (meq.group_id = meqg1.id)
          WHERE region_id = ${region_id} AND slug ="${slug}"`,
      );
      queryRunner.release();
      if (enrollmentQuestion.length) {
        return enrollmentQuestion;
      } else {
        return [];
      }
    }
    throw new BadRequestException('Not found Enrollment Questions Input');
  }
}
