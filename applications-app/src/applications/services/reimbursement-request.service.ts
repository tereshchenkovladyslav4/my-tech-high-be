import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateOrUpdateReimbursementReceiptInput } from '../dto/create-or-update-reimbursement-receipt.input';
import { CreateOrUpdateReimbursementRequestInputs } from '../dto/create-or-update-reimbursement-request.inputs';
import { ReimbursementRequestSearchInput } from '../dto/reimbursement-request-search.inputs';
import { ReimbursementOtherFilter, ReimbursementRequestStatus, ReimbursementRequestType } from '../enums';
import { ReimbursementReceipt } from '../models/reimbursement-receipt.entity';
import { ReimbursementRequest } from '../models/reimbursement-request.entity';
import { Pagination } from '../../paginate';
import { ReimbursementRequestsArgs } from '../dto/reimbursement-requests.args';
import { ReimbursementReceiptsActionInput } from '../dto/reimbursement-receipts-action.input';
import { EmailsService } from './emails.service';
import { EmailTemplatesService } from './email-templates.service';
import { DO_EMAIL_TEMPLATES, RB_EMAIL_TEMPLATES } from '../constants';
import { reimbursementRequestStatus, renderCommaString, showDate } from '../utils';
import { TimezonesService } from './timezones.service';
import * as process from 'process';
import { ReimbursementRequestEmailsService } from './reimbursement-request-emails.service';
import { ReimbursementRequestEmail } from '../models/reimbursement-request-email.entity';
import { ReimbursementRequestsActionInput } from '../dto/reimbursement-requests-action.input';

@Injectable()
export class ReimbursementRequestService {
  constructor(
    @InjectRepository(ReimbursementRequest)
    private readonly repo: Repository<ReimbursementRequest>,
    @InjectRepository(ReimbursementReceipt)
    private readonly receiptRepo: Repository<ReimbursementReceipt>,
    private sesEmailService: EmailsService,
    private emailTemplateService: EmailTemplatesService,
    private timezoneService: TimezonesService,
    private reimbursementRequestEmailsService: ReimbursementRequestEmailsService,
  ) {}

  async find(args: ReimbursementRequestsArgs): Promise<Pagination<ReimbursementRequest>> {
    const { schoolYearId, skip, take, sort, filter, search } = args;
    const qb = await this.repo
      .createQueryBuilder('reimbursementRequest')
      .leftJoinAndSelect('reimbursementRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'Person')
      .leftJoinAndSelect('Student.grade_levels', 'GradeLevels', `GradeLevels.school_year_id = ${schoolYearId}`)
      .leftJoinAndSelect('Student.parent', 'Parent')
      .leftJoinAndSelect('Parent.person', 'ParentPerson')
      .leftJoinAndSelect('reimbursementRequest.ReimbursementRequestEmails', 'ReimbursementRequestEmails')
      .where(`reimbursementRequest.SchoolYearId = ${schoolYearId}`);

    if (filter) {
      // TODO others filter
      const { requests, types, others, statuses, grades } = filter;
      if (
        requests?.includes(`${ReimbursementRequestType.DIRECT_ORDER}`) &&
        !requests?.includes(`${ReimbursementRequestType.REIMBURSEMENT}`)
      ) {
        qb.andWhere('reimbursementRequest.is_direct_order = true');
      }
      if (
        requests?.includes(`${ReimbursementRequestType.REIMBURSEMENT}`) &&
        !requests?.includes(`${ReimbursementRequestType.DIRECT_ORDER}`)
      ) {
        qb.andWhere('reimbursementRequest.is_direct_order = false');
      }

      if (types?.length) {
        qb.andWhere(`reimbursementRequest.form_type IN ("${types.join('","')}")`);
      }

      if (statuses?.length) {
        qb.andWhere(`reimbursementRequest.status IN ("${statuses.join('","')}")`);
      }

      if (others?.includes(`${ReimbursementOtherFilter.GRADE_REQUIREMENT}`)) {
      }

      if (grades?.length) {
        qb.andWhere(`GradeLevels.grade_level IN ("${grades.join('","')}")`);
      }
    }

    if (search) {
      qb.andWhere(
        new Brackets((sub) => {
          sub.where('Person.first_name like :text', { text: `%${search}%` });
          sub.orWhere('Person.last_name like :text', { text: `%${search}%` });
          sub.orWhere('Person.email like :text', { text: `%${search}%` });
        }),
      );
    }

    if (sort) {
      const [sortBy, sortOrder] = sort.split('|');
      switch (sortBy) {
        case 'date_submitted': {
          qb.orderBy('reimbursementRequest.date_submitted', sortOrder === 'asc' ? 'DESC' : 'ASC');
          break;
        }
        case 'total_amount': {
          qb.orderBy('reimbursementRequest.total_amount', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'studentName': {
          qb.orderBy('Person.last_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          qb.addOrderBy('Person.first_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'grade': {
          qb.orderBy('GradeLevels.grade_level', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'parentName': {
          qb.orderBy('ParentPerson.last_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          qb.addOrderBy('ParentPerson.first_name', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'requestStatus': {
          qb.orderBy('reimbursementRequest.status', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'date_paid': {
          qb.orderBy('reimbursementRequest.date_paid', sortOrder === 'asc' ? 'DESC' : 'ASC');
          qb.addOrderBy('reimbursementRequest.date_ordered', sortOrder === 'asc' ? 'DESC' : 'ASC');
          break;
        }
        case 'form_type': {
          qb.orderBy('reimbursementRequest.form_type', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
        case 'periods': {
          qb.orderBy('reimbursementRequest.periods', sortOrder === 'asc' ? 'ASC' : 'DESC');
          break;
        }
      }
    }
    qb.addOrderBy('ReimbursementRequestEmails.created_at', 'DESC');

    const [results, total] = await qb.skip(skip).take(take).getManyAndCount();

    return new Pagination<ReimbursementRequest>({
      results,
      total,
    });
  }

  async findOne(reimbursementRequestId: number): Promise<ReimbursementRequest> {
    const result = await this.repo
      .createQueryBuilder('reimbursementRequest')
      .leftJoinAndSelect('reimbursementRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'Person')
      .leftJoinAndSelect(
        'Student.grade_levels',
        'GradeLevels',
        `GradeLevels.school_year_id = reimbursementRequest.SchoolYearId`,
      )
      .leftJoinAndSelect('Student.parent', 'Parent')
      .leftJoinAndSelect('Parent.person', 'ParentPerson')
      .leftJoinAndSelect('reimbursementRequest.SchoolYear', 'SchoolYear')
      .leftJoinAndSelect('SchoolYear.ReimbursementSetting', 'ReimbursementSetting')
      .leftJoinAndSelect('reimbursementRequest.ReimbursementReceipts', 'ReimbursementReceipts')
      .where(`reimbursementRequest.reimbursement_request_id = ${reimbursementRequestId}`)
      .getOne();

    const sameTypeRequestQb = await this.repo
      .createQueryBuilder('reimbursementRequest')
      .where(`reimbursementRequest.form_type = "${result.form_type}"`)
      .andWhere(`StudentId = ${result.StudentId}`)
      .andWhere(`reimbursement_request_id <> ${result.reimbursement_request_id}`)
      .andWhere(`status <> "${ReimbursementRequestStatus.DRAFT}"`);
    const { merged_periods } = result.SchoolYear.ReimbursementSetting;
    if (!!merged_periods) {
      const isMerged = result.periods?.split(',')?.length > 1;
      if (isMerged) {
        sameTypeRequestQb.andWhere(`(LENGTH(periods) - LENGTH(REPLACE(periods,",","")) + 1) > 1`);
      } else {
        sameTypeRequestQb.andWhere(`(LENGTH(periods) - LENGTH(REPLACE(periods,",","")) + 1) < 2`);
      }
    }
    result.SameTypeRequests = await sameTypeRequestQb.getMany();
    return result;
  }

  async findForStudents(param: ReimbursementRequestSearchInput): Promise<ReimbursementRequest[]> {
    const { filter } = param;
    const { SchoolYearId, StudentIds } = filter;

    const qb = this.repo
      .createQueryBuilder('reimbursementRequest')
      .leftJoinAndSelect('reimbursementRequest.Student', 'Student')
      .leftJoinAndSelect('Student.person', 'person')
      .leftJoinAndSelect('reimbursementRequest.SchoolYear', 'SchoolYear')
      .leftJoinAndSelect('reimbursementRequest.ReimbursementReceipts', 'ReimbursementReceipts')
      .where(`reimbursementRequest.SchoolYearId = ${SchoolYearId}`);

    if (StudentIds?.length) {
      qb.andWhere('reimbursementRequest.StudentId IN (:StudentIds)', {
        StudentIds: StudentIds,
      });
    }

    return qb.getMany();
  }

  async deleteReimbursementRequests(
    reimbursementRequestsActionInput: ReimbursementRequestsActionInput,
  ): Promise<boolean> {
    try {
      const { reimbursementRequestIds } = reimbursementRequestsActionInput;
      reimbursementRequestIds.map(async (reimbursementRequestId) => {
        await this.repo.delete({ reimbursement_request_id: reimbursementRequestId });
      });
      return true;
    } catch (error) {
      return error;
    }
  }

  async delete(reimbursement_request_id: number): Promise<boolean> {
    try {
      await this.repo.delete(reimbursement_request_id);
      return true;
    } catch (error) {
      return error;
    }
  }

  async saveReceipts(receiptsInput: CreateOrUpdateReimbursementReceiptInput): Promise<ReimbursementReceipt[]> {
    try {
      return await this.receiptRepo.save(receiptsInput?.receipts);
    } catch (error) {
      return error;
    }
  }

  async deleteReimbursementReceipts(
    reimbursementReceiptsActionInput: ReimbursementReceiptsActionInput,
  ): Promise<boolean> {
    const { receiptIds } = reimbursementReceiptsActionInput;
    receiptIds.map(async (receiptId) => {
      await this.receiptRepo.delete({ reimbursement_receipt_id: receiptId });
    });
    return true;
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
        case ReimbursementRequestStatus.APPROVED:
          requestInput.date_paid = new Date();
          break;
      }

      const request = await this.repo
        .createQueryBuilder('reimbursementRequest')
        .leftJoinAndSelect('reimbursementRequest.Student', 'Student')
        .leftJoinAndSelect('Student.person', 'Person')
        .leftJoinAndSelect('reimbursementRequest.SchoolYear', 'SchoolYear')
        .leftJoinAndSelect('Student.parent', 'Parent')
        .leftJoinAndSelect('Parent.person', 'ParentPerson')
        .leftJoinAndSelect('Student.applications', 'applications')
        .where({ reimbursement_request_id: requestInput.reimbursement_request_id })
        .getOne();

      if (request?.status && requestInput.status && request.status != requestInput.status) {
        const templateName = (request.is_direct_order ? DO_EMAIL_TEMPLATES : RB_EMAIL_TEMPLATES)?.[requestInput.status];
        if (templateName) {
          const emailTemplate = await this.emailTemplateService.findByTemplateSchoolYear(
            templateName,
            request.SchoolYear?.RegionId,
            request.SchoolYearId,
            !!request.Student?.applications?.find((item) => item.school_year_id == request.SchoolYearId)
              ?.midyear_application,
          );
          if (emailTemplate) {
            const { subject, body, from, standard_responses } = emailTemplate;
            await this.sendEmail(subject, body, from, request, standard_responses);
          }
        }
      }

      return await this.repo.save(requestInput);
    } catch (error) {
      return error;
    }
  }

  async sendEmail(
    subject: string,
    body: string,
    from: string,
    request: ReimbursementRequest,
    standard_responses?: string,
  ): Promise<ReimbursementRequestEmail> {
    try {
      const content = body
        .toString()
        .replace(/\[STUDENT\]/g, request.Student.person.first_name)
        .replace(/\[PARENT\]/g, request.Student.parent.person.first_name)
        .replace(
          /\[SUBMITTED\]/g,
          showDate(await this.timezoneService.getTimezoneDate(request.SchoolYear?.RegionId, request.date_submitted)),
        )
        .replace(/\[AMOUNT\]/g, `$${(+request.total_amount || 0).toFixed(2)}`)
        .replace(/\[CATEGORY\]/g, reimbursementRequestStatus(request.status as ReimbursementRequestStatus))
        .replace(/\[PERIOD\]/g, `Period ${renderCommaString(request.periods)}`)
        .replace(/\[LINK\]/g, `${process.env.WEB_APP_URL}/reimbursements`)
        .replace(/\[INSTRUCTIONS\]/g, standard_responses)
        .replace(/\[CONFIRMATION\]/g, '');

      const email = await this.sesEmailService.sendEmail({
        email: request.Student.parent.person.email,
        subject: subject.toString(),
        content,
        from,
        region_id: request.SchoolYear?.RegionId,
        template_name: '',
      });
      return await this.reimbursementRequestEmailsService.create({
        reimbursement_request_id: request.reimbursement_request_id,
        email_record_id: email.results?.emailRecordId,
        from_email: from,
        subject: subject,
        body: content,
      });
    } catch (e) {
      return e;
    }
  }
}
