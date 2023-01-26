import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrUpdateReimbursementRequestInputs } from '../dto/create-or-update-reimbursement-request.inputs';
import { ReimbursementRequestSearchInput } from '../dto/reimbursement-request-search.inputs';
import { ReimbursementRequestStatus } from '../enums';
import { ReimbursementRequest } from '../models/reimbursement-request.entity';

@Injectable()
export class ReimbursementRequestService {
  constructor(
    @InjectRepository(ReimbursementRequest)
    private readonly repo: Repository<ReimbursementRequest>,
  ) {}

  async findByFilter(param: ReimbursementRequestSearchInput): Promise<ReimbursementRequest[]> {
    const { filter } = param;
    const { SchoolYearId, StudentIds } = filter;

    const qb = this.repo
      .createQueryBuilder('reimbursementRequest')
      .leftJoinAndSelect('reimbursementRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'person')
      .leftJoinAndSelect('reimbursementRequest.SchoolYear', 'SchoolYear')
      .where(`reimbursementRequest.SchoolYearId = ${SchoolYearId}`);

    if (StudentIds?.length) {
      qb.andWhere('reimbursementRequest.StudentId IN (:StudentIds)', {
        StudentIds: StudentIds,
      });
    }

    return qb.getMany();
  }

  async save(requestInput: CreateOrUpdateReimbursementRequestInputs): Promise<ReimbursementRequest> {
    try {
      switch (requestInput?.status) {
        case ReimbursementRequestStatus.SUBMITTED:
        case ReimbursementRequestStatus.RESUBMITTED:
          requestInput.date_submitted = new Date();
          break;
        case ReimbursementRequestStatus.PAID:
          requestInput.date_paid = new Date();
          break;
      }
      const result = await this.repo.save(requestInput);
      return result;
    } catch (error) {
      return error;
    }
  }

  async delete(remimbursement_request_id: number): Promise<boolean> {
    try {
      await this.repo.delete(remimbursement_request_id);
      return true;
    } catch (error) {
      return error;
    }
  }
}
