import { Directive, Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ReimbursementRequest } from './reimbursement-request.entity';

@InputType('reimbursement_receipt')
@ObjectType()
@Directive('@key(fields: "reimbursement_receipt_id, ReimbursementRequestId, file_id, file_name, amount, created_at")')
@Entity({ name: 'mth_reimbursement_receipt' })
export class ReimbursementReceipt extends BaseEntity {
  @Column('int', { name: 'reimbursement_receipt_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  reimbursement_receipt_id: number;

  @Column('int', { name: 'ReimbursementRequestId', nullable: true })
  @Field(() => Int, { nullable: true })
  ReimbursementRequestId: number;

  @Column('int', { name: 'file_id', nullable: true })
  @Field(() => Int, { nullable: true })
  file_id: number;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  file_name: string;

  @Column('decimal', {
    name: 'amount',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  amount: number | null;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at: Date;

  @ManyToOne(() => ReimbursementRequest, (reimbursementRequest) => reimbursementRequest.ReimbursementReceipts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ReimbursementRequestId', referencedColumnName: 'reimbursement_request_id' })
  @Field(() => ReimbursementRequest, { nullable: true })
  ReimbursementRequest?: ReimbursementRequest;
}
