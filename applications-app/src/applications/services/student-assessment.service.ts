import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateStudentAssessmentInput } from '../dto/create-or-update-student-assessment.inputs';
import { StudentAssessmentOption } from '../models/student-assessment-option.entity';

@Injectable()
export class StudentAssessmentService {
  constructor(
    @InjectRepository(StudentAssessmentOption)
    private readonly repo: Repository<StudentAssessmentOption>,
  ) {}

  async find(student_id: number): Promise<StudentAssessmentOption[]> {
    const data = await this.repo.find({
      where: { StudentId: student_id },
      relations: ['Assessment', 'AssessmentOption'],
    });
    return data;
  }

  async save(studentAssessmentInput: CreateOrUpdateStudentAssessmentInput): Promise<StudentAssessmentOption> {
    try {
      const data = await this.repo.findOne({
        where: { StudentId: studentAssessmentInput?.StudentId, AssessmentId: studentAssessmentInput?.AssessmentId },
      });
      if (data) studentAssessmentInput.assessment_option_id = data.assessment_option_id;
      const result = await this.repo.save(studentAssessmentInput);
      return result;
    } catch (error) {
      throw new ServiceUnavailableException(error);
    }
  }

  async updateTestAnswer(testing_preference: string): Promise<boolean> {
    try {
      const testData = JSON.parse(testing_preference);
      for (let i = 0; i < testData.length; i++) {
        await this.repo.update(
          {
            assessment_option_id: testData[i].assessmentOptionId,
          },
          {
            OptionId: testData[i].optionId,
          },
        );
      }
      return true;
    } catch (error) {
      return false;
    }
  }
}
