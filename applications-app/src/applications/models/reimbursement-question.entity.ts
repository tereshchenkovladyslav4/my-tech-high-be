import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReimbursementFormType } from '../enums';
import { SchoolYear } from './schoolyear.entity';

@InputType('reimbursementQuestion')
@ObjectType()
@Directive(
  '@key(fields: "reimbursement_question_id, SchoolYearId, type, question, options, priority, required, slug, default_question, reimbursement_form_type, is_direct_order, sortable, display_for_admin, additional_question")',
)
@Entity({ name: 'mth_reimbursement_question' })
export class ReimbursementQuestion extends BaseEntity {
  @Column('int', { name: 'reimbursement_question_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  reimbursement_question_id: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  type: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  question: string;

  @Column('varchar', { nullable: true })
  @Field(() => String, { nullable: true })
  status: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  options: string;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  priority: number;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  required: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  slug: string;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  default_question: boolean;

  @Column('varchar', { nullable: true, default: null })
  @Field(() => ReimbursementFormType, { nullable: true })
  reimbursement_form_type: ReimbursementFormType;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  is_direct_order: boolean;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  sortable: boolean;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  display_for_admin: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  additional_question: string;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.ReimbursementQuestions, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SchoolYearId', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;
}
