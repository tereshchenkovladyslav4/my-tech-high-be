import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, school_year_id, information, supplemental_reimbursements_forms, supplemental_direct_order_forms, technology_reimbursements_forms, technology_direct_order_forms, custom_reimbursements_forms, custom_direct_order_forms, is_merged_periods, merged_periods, merged_periods_reimbursements_forms, merged_periods_direct_order_forms, third_party_reimbursements_forms, require_software_reimbursements_forms, max_receipts, require_passing_grade, min_grade_percentage, allow_delete, allow_submit_with_updates_required, auto_delete_updates_required, num_days_delete_updates_required, display_remaining_funds, SchoolYear, remaining_funds")',
)
@Entity({ name: 'mth_reimbursement_setting' })
export class ReimbursementSetting extends BaseEntity {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  school_year_id: number | null;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  information: string;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  supplemental_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  supplemental_direct_order_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  technology_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  technology_direct_order_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  custom_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  custom_direct_order_forms: number | null;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  is_merged_periods: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  merged_periods: string;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  merged_periods_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  merged_periods_direct_order_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  third_party_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  require_software_reimbursements_forms: number | null;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  max_receipts: number | null;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  require_passing_grade: boolean;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  min_grade_percentage: number | null;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  allow_delete: boolean;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  allow_submit_with_updates_required: boolean;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  auto_delete_updates_required: boolean;

  @Column('int', { nullable: true })
  @Field(() => Int, { nullable: true })
  num_days_delete_updates_required: number | null;

  @Column('tinyint', { nullable: true, default: null })
  @Field(() => Boolean, { nullable: true })
  display_remaining_funds: boolean;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  remaining_funds: string;

  @OneToOne(() => SchoolYear, (schoolYear) => schoolYear.school_year_id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'school_year_id', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;
}
