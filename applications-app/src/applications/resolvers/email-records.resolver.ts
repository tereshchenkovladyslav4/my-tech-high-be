import {
    Args,
    ID,
    Query,
    Resolver,
    ResolveReference,
    Mutation,
    ResolveField,
    Parent,
    Context,
  } from '@nestjs/graphql';
  
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { EmailRecord } from '../models/email-record.entity';
import { EmailRecordsService } from '../services/email-records.service';
import { EmailRecordPagination } from '../models/email-record-pagination';
import { EmailRecordArgs } from '../dto/email-records.args';
import { Pagination } from '../../paginate';
import { ResponseDTO } from '../dto/response.dto';
import { DeleteRecordInput } from '../dto/delete-record.input';
import { UpdateEmailRecordInput } from '../dto/update-email-record.input';

@Resolver((of) => EmailRecord)
export class EmailRecordResolver {
    constructor(
        private emailRecordsService : EmailRecordsService
    ) { }

    @Query((returns) => EmailRecordPagination, { name: 'emailRecords' })
    //@UseGuards(new AuthGuard())
    async getEmailRecords(@Args() emailRecordArgs: EmailRecordArgs,): Promise<Pagination<EmailRecord>> {
        return this.emailRecordsService.findAll(emailRecordArgs);
    }

    @Query((returns) => ResponseDTO, { name: 'emailRecordsCountByRegionId' })
    @UseGuards(new AuthGuard())
    async getpacketCountByRegionId(@Args({ name: 'region_id', type: () => ID }) region_id: number,): Promise<ResponseDTO> {
        return this.emailRecordsService.getRecordCountByRegionId(region_id);
    }

    @Mutation((returns) => [EmailRecord], { name: 'deleteRecords' })
    async deleteRecords(@Args('deleteRecordInput') deleteRecordInput: DeleteRecordInput,): Promise<EmailRecord[]> {
        return await this.emailRecordsService.deleteRecord(deleteRecordInput);
    }

    @Mutation((returns) => Boolean, { name: 'resendRecords' })
    async resendRecords(@Args('deleteRecordInput') deleteRecordInput: DeleteRecordInput,): Promise<Boolean> {
        return await this.emailRecordsService.resendRecords(deleteRecordInput);
    }

    @Mutation((returns) => Boolean, { name: 'resendEmail' })
    async resendEmail(@Args('resendEmailInput') resendEmailInput: UpdateEmailRecordInput,): Promise<Boolean> {
        return await this.emailRecordsService.resendEmail(resendEmailInput);
    }
}

