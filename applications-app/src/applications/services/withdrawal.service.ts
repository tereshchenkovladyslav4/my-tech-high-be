import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { UpdateWithdrawalInput } from '../dto/update-withdrawal.inputs';
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

  async findAll(): Promise<Array<Withdrawal>> {
    try {
      const results = await this.withdrawalRepository
        .createQueryBuilder('withdrawal')
        .leftJoinAndSelect('withdrawal.Student', 'student')
        .leftJoinAndSelect('student.student_grade_level', 'grad_levels')
        .leftJoinAndSelect('student.person', 'person')
        .getMany();
      return results;
    } catch (error) {
      return [];
    }
  }
}
