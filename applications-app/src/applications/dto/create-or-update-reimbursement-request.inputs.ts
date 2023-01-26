import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ReimbursementFormType } from '../enums';

@InputType()
export class CreateOrUpdateReimbursementRequestInputs {
  @Field(() => Int, { nullable: true })
  reimbursement_request_id?: number;

  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Field(() => Int, { nullable: true })
  ParentId: number;

  @Field(() => Boolean, { nullable: true })
  is_direct_order: boolean;

  @Field(() => ReimbursementFormType, { nullable: true })
  form_type: ReimbursementFormType;

  @Field(() => String, { nullable: true })
  periods?: string;

  @Field(() => String, { nullable: true })
  status: string;

  @Field(() => Float, { nullable: true })
  total_amount: number | null;

  @Field(() => String, { nullable: true })
  signature_name: string;

  @Field(() => Int, { nullable: true })
  signature_file_id: number;

  @Field(() => String, { nullable: true })
  meta: string;

  @Field(() => Date, { nullable: true })
  date_submitted: Date;

  @Field(() => Date, { nullable: true })
  date_paid: Date;

  @Field(() => Date, { nullable: true })
  date_ordered: Date;
}
