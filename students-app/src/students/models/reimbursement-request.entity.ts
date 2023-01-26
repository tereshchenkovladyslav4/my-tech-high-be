import { Directive, Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReimbursementFormType } from '../enums';

@InputType('reimbursement_request')
@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "reimbursement_request_id, SchoolYearId, StudentId, ParentId, is_direct_order, form_type, periods, status, total_amount, signature_name, signature_file_id, meta, date_submitted, date_paid, date_ordered")',
)
@Entity({ name: 'mth_reimbursement_request' })
export class ReimbursementRequest extends BaseEntity {
  @Column('int', { name: 'reimbursement_request_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  reimbursement_request_id: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  StudentId: number;

  @Column('int', { name: 'ParentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  ParentId: number;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_direct_order: boolean;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => ReimbursementFormType, { nullable: true })
  @Directive('@external')
  form_type: ReimbursementFormType;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  periods: string;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  status: string;

  @Column('decimal', {
    name: 'total_amount',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  total_amount: number | null;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  signature_name: string;

  @Column('int', { nullable: true, default: null })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  signature_file_id: number;

  @Column('text', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  meta: string;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_submitted: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_paid: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_ordered: Date;
}
