import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateWithdrawalInput } from '../dto/update-withdrawal.inputs';
import { WithdrawalResponse } from '../models/withdrawal-response.entity';
import { Withdrawal } from '../models/withdrawal.entity';

export enum WithdrawalStatus {
  Notified = 'Notified',
  Withdrawn = 'Withdrawn',
  Requested = 'Requested',
}

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
  ) {}

  async update(updateWithdrawalInput: UpdateWithdrawalInput): Promise<boolean> {
    try {
      const { StudentId, status } = updateWithdrawalInput;

      await this.withdrawalRepository.save({
        StudentId,
        status,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async delete(student_id: number): Promise<boolean> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      await queryRunner.query(
        `DELETE FROM infocenter.withdrawal WHERE StudentId=${student_id}`,
      );
      queryRunner.release();
      return true;
    } catch (error) {
      return false;
    }
  }

  async findAll(region_id: number): Promise<Array<WithdrawalResponse>> {
    try {
      const queryRunner = await getConnection().createQueryRunner();
      const withdrawals = await queryRunner.query(
        `SELECT
          withdrawals.*,
          person.first_name,
          person.last_name,
          gradeLevel.grade_level
        FROM (
          SELECT * FROM infocenter.withdrawal
        ) AS withdrawals
        LEFT JOIN infocenter.mth_application application ON (application.student_id = withdrawals.StudentId)
        LEFT JOIN infocenter.mth_student_grade_level gradeLevel ON (gradeLevel.student_id = application.student_id AND gradeLevel.school_year_id = application.school_year_id)
        LEFT JOIN infocenter.mth_student student ON (student.student_id = application.student_id)
        LEFT JOIN infocenter.mth_person person ON (person.person_id = student.person_id)
        LEFT JOIN infocenter.mth_schoolyear schoolYear ON (schoolYear.school_year_id = application.school_year_id)
        WHERE
          schoolYear.RegionId = ${region_id}`,
      );
      queryRunner.release();
      const result = withdrawals.map((withdrawal) => ({
        ...withdrawal,
      }));
      return result;
    } catch (error) {
      return [];
    }
  }
}
