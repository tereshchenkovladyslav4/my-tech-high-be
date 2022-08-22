import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { CreateEmailRecordInput } from '../dto/new-email-record.inputs';
import { UpdateEmailRecordInput } from '../dto/update-email-record.input';
import { EmailRecord } from '../models/email-record.entity';
import { EmailRecordArgs } from '../dto/email-records.args';
import { Pagination } from '../../paginate';
import { ResponseDTO } from '../dto/response.dto';
import { DeleteRecordInput } from '../dto/delete-record.input';
import * as Moment from 'moment';
import { SESService } from './ses.service';
import { travelSchemaPossibleExtensions } from 'graphql-tools';

@Injectable()
export class EmailRecordsService {
  constructor(
    @InjectRepository(EmailRecord)
    private readonly emailRecordsRepository: Repository<EmailRecord>,
    private SESService: SESService,
  ) { }

  async create(emailRecord:CreateEmailRecordInput ): Promise<EmailRecord> {
    return this.emailRecordsRepository.save(emailRecord);
  }

  async findAll(emailRecordArgs: EmailRecordArgs): Promise<Pagination<EmailRecord>> {
    const { skip, take, sort, filters, search, region_id } = emailRecordArgs;
    const _sortBy = sort.split('|');

    if (filters.length === 0) {
      return new Pagination<EmailRecord>({
        results: [],
        total: 0,
      });
    }

    let qb = this.emailRecordsRepository
      .createQueryBuilder('record')
      .where(`record.region_id = ${region_id}`)
      .andWhere('record.status IN (:status)', { status: filters })      
    
    if (search) {
      const date = search
        .split('/')
        .filter((v) => v)
        .join('-');
      qb.andWhere(
        new Brackets((sub) => {
          if (
            search.indexOf('st') > -1 ||
            search.indexOf('th') > -1 ||
            search.indexOf('rd') > -1 ||
            search.indexOf('nd') > -1
          ) {
            sub.where('grade_levels.grade_level like :text', {
              text: `%${search.match(/\d+/)[0]}%`,
            });
          } else {
            sub
              .orWhere('record.status like :text', { text: `%${search}%` })
              .orWhere('record.to_email like :text', { text: `%${search}%` })
              .orWhere('record.from_email like :text', { text: `%${search}%` })
              .orWhere('record.subject like :text', { text: `%${search}%` })              
              .orWhere('record.template_name like :text', { text: `%${search}%` });
              
            if (Moment(search, 'MM/DD/YY', true).isValid()) {
              sub.orWhere('packet.deadline like :text', {
                text: `%${Moment(search).format('YYYY-MM-DD')}%`,
              });
            }
          }
        }),
      );
    }

    if (sort) {
        let sort_filed = 'id';

        if (_sortBy[0] == 'date')
            sort_filed = 'created_at';
        else if (_sortBy[0] == 'to')
            sort_filed = 'to_email';
        else if (_sortBy[0] == 'email_template')
            sort_filed = 'template_name'
        else if (_sortBy[0] == 'subject')
            sort_filed = 'subject'
        else if (_sortBy[0] == 'from')
            sort_filed = 'from_email'
        else if (_sortBy[0] == 'status')
            sort_filed = 'status'

        if (_sortBy[1].toLocaleLowerCase() == 'desc')
            qb.orderBy('record.' + sort_filed, 'DESC');
        else
            qb.orderBy('record.' + sort_filed, 'ASC');
    }

    let result = [];
    const [results, total] = await qb.getManyAndCount();
    if (take) {
      if (total < (skip || 0) + take) {
        result = results.slice(skip || 0, results.length);
      } else {
        result = results.slice(skip || 0, take + (skip || 0));
      }
    }
    return new Pagination<EmailRecord>({
      results: result,
      total,
    });
  }


  async getRecordCountByRegionId(region_id: number): Promise<ResponseDTO> {
    let qb = await this.emailRecordsRepository.query(
      `SELECT
          t1.status AS status,
          COUNT(*) AS count
        FROM (
          SELECT * FROM infocenter.mth_email_records where region_id = ${region_id}
        ) AS t1        
        GROUP BY t1.status`,
    );
    const statusArray = {
      'Sent': 0,
      'Error': 0,
    };

    qb.map((item) => {
      statusArray[item.status] = +item.count;
    });
    return <ResponseDTO>{
      error: false,
      results: statusArray,
    };
  }

  async deleteRecord(deleteRecordInput: DeleteRecordInput): Promise<EmailRecord[]> {
    const { record_ids } = deleteRecordInput;
    const records = await this.emailRecordsRepository.findByIds(
        record_ids,
    );
    const result = await this.emailRecordsRepository.delete(record_ids);
    return records;
  }

  async resendRecords(deleteRecordInput: DeleteRecordInput): Promise<Boolean> {
    const { record_ids } = deleteRecordInput;
    const records = await this.emailRecordsRepository.findByIds(record_ids);
    await this.emailRecordsRepository.delete(record_ids);

    for (let i = 0; i < records.length; i++) {
        const record = records[i]
        const result = await this.SESService.sendEmail(
            record.to_email,
            record.subject,
            record.body,
            record.bcc,
            record.from_email,
          );
    
        const email_status = (result == false ? 'Sent' : 'Error');
    
        // Add Email Records
        await this.emailRecordsRepository.insert({
            subject: record.subject,
            body: record.body,
            to_email: record.to_email,
            from_email: record.from_email,
            template_name: record.template_name,
            region_id: record.region_id,
            bcc: record.bcc,
            status: email_status
        });
    }

    return true;
  }

  async resendEmail(record: UpdateEmailRecordInput): Promise<Boolean> {
    const {id} = record;
    await this.emailRecordsRepository.delete(id);
    
    const result = await this.SESService.sendEmail(
        record.to_email,
        record.subject,
        record.body,
        record.bcc,
        record.from_email,
      );

    const email_status = (result == false ? 'Sent' : 'Error');

    // Add Email Records
    await this.emailRecordsRepository.insert({
        subject: record.subject,
        body: record.body,
        to_email: record.to_email,
        from_email: record.from_email,
        template_name: record.template_name,
        region_id: record.region_id,
        bcc: record.bcc,
        status: email_status
    });
    return true
  }
}
