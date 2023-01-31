import { Field, InputType } from '@nestjs/graphql';
import { ReimbursementReceipt } from '../models/reimbursement-receipt.entity';

@InputType()
export class CreateOrUpdateReimbursementReceiptInput {
  @Field(() => [ReimbursementReceipt], { nullable: true })
  receipts: ReimbursementReceipt[];
}
