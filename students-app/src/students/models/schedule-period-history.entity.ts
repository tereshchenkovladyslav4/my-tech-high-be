import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Course } from './course.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "schedule_period_history_id, ScheduleHistoryId, PeriodId, SubjectId, TitleId, ProviderId, CourseId, course_type, custom_build_description, tp_provider_name, tp_course_name, tp_phone_number, tp_specific_course_website, tp_additional_specific_course_website, osse_course_name, osse_district_school, osse_school_district_name")',
)
@Entity({ name: 'mth_schedule_period_history' })
export class SchedulePeriodHistory extends BaseEntity {
  @Column('int', { name: 'schedule_period_history_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  schedule_period_history_id: number;

  @Column('int', { name: 'ScheduleHistoryId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  ScheduleHistoryId: number;

  @Column('int', { name: 'PeriodId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  PeriodId: number;

  @Column('int', { name: 'SubjectId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SubjectId: number;

  @Column('int', { name: 'TitleId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  TitleId: number;

  @Column('int', { name: 'ProviderId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  ProviderId: number;

  @Column('int', { name: 'CourseId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  CourseId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  course_type: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  custom_build_description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  tp_provider_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  tp_course_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  tp_phone_number: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  tp_specific_course_website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  tp_additional_specific_course_website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  osse_course_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  osse_district_school: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  osse_school_district_name: string;

  @ManyToOne(() => Course, (schedule) => schedule.SchedulePeriodHistories)
  @JoinColumn([{ name: 'CourseId', referencedColumnName: 'id' }])
  @Directive('@external')
  Course: Course;
}
