import { Directive, Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ReimbursementFormType } from '../enums';
import { ReimbursementReceipt } from './reimbursement-receipt.entity';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';
import { ResourceRequestEmail } from './resource-request-email.entity';
import { ReimbursementRequestEmail } from './reimbursement-request-email.entity';

@InputType('reimbursement_request')
@ObjectType()
@Directive(
  '@key(fields: "reimbursement_request_id, SchoolYearId, StudentId, ParentId, is_direct_order, form_type, periods, status, total_amount, signature_name, signature_file_id, meta, date_submitted, date_paid, date_ordered")',
)
@Entity({ name: 'mth_reimbursement_request' })
export class ReimbursementRequest extends BaseEntity {
  @Column('int', { name: 'reimbursement_request_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  reimbursement_request_id: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Column('int', { name: 'ParentId', nullable: true })
  @Field(() => Int, { nullable: true })
  ParentId: number;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  is_direct_order: boolean;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => ReimbursementFormType, { nullable: true })
  form_type: ReimbursementFormType;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  periods: string;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  status: string;

  @Column('decimal', {
    name: 'total_amount',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  total_amount: number | null;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  signature_name: string;

  @Column('int', { nullable: true, default: null })
  @Field(() => Int, { nullable: true })
  signature_file_id: number;

  @Column('text', { nullable: true, default: null })
  @Field(() => String, { nullable: true })
  meta: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_submitted: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_paid: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_ordered: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.ReimbursementRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SchoolYearId', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @ManyToOne(() => Student, (student) => student.ReimbursementRequests, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  @Field(() => Student, { nullable: true })
  Student: Student;

  @OneToMany(() => ReimbursementReceipt, (reimbursementRecipt) => reimbursementRecipt.ReimbursementRequest)
  @Field(() => [ReimbursementReceipt], { nullable: true })
  ReimbursementReceipts: ReimbursementReceipt[];

  @Field(() => [ReimbursementRequest], { nullable: true })
  SameTypeRequests: ReimbursementRequest[];

  @OneToMany(
    () => ReimbursementRequestEmail,
    (reimbursementRequestEmail) => reimbursementRequestEmail.ReimbursementRequest,
  )
  @Field(() => [ReimbursementRequestEmail], { nullable: true })
  ReimbursementRequestEmails: ReimbursementRequestEmail[];
}
