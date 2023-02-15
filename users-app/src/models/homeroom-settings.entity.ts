import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@Directive('@extends')
@ObjectType()
@Directive(
  '@key(fields: "id, SchoolYearId, days_to_submit_early, max_of_excused_learning_logs_allowed, grading_scale_percentage, passing_average, grades_by_subject, notify_when_graded, update_required_schedule_to_sumbit, notify_when_resubmit_required, gender, special_education, diploma, zero_count, SchoolYear")',
)
@Entity('mth_homeroom_settings')
export class HomeroomSettings extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number;

  @Column('int', { name: 'days_to_submit_early', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  days_to_submit_early: number;

  @Column('int', { name: 'max_of_excused_learning_logs_allowed', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_of_excused_learning_logs_allowed: number;

  @Column('int', { name: 'grading_scale_percentage', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  grading_scale_percentage: number;

  @Column('int', { name: 'passing_average', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  passing_average: number;

  @Column('tinyint', { name: 'grades_by_subject', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  grades_by_subject: boolean;

  @Column('tinyint', { name: 'notify_when_graded', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  notify_when_graded: boolean;

  @Column('tinyint', { name: 'update_required_schedule_to_sumbit', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  update_required_schedule_to_sumbit: boolean;

  @Column('tinyint', { name: 'notify_when_resubmit_required', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  notify_when_resubmit_required: boolean;

  @Column('tinyint', { name: 'gender', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  gender: boolean;

  @Column('tinyint', { name: 'special_education', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  special_education: boolean;

  @Column('tinyint', { name: 'diploma', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  diploma: boolean;

  @Column('tinyint', { name: 'zero_count', nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  zero_count: boolean;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.HomeroomSettings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  @Directive('@external')
  SchoolYear: SchoolYear;
}
