import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Period } from './period.entity';
import { Subject } from './subject.entity';
import { Title } from './title.entity';
import { Provider } from './provider.entity';
import { Course } from './course.entity';
import { SchedulePeriodStatus } from '../enums';

@InputType('schedule_period')
@ObjectType()
@Directive(
  '@key(fields: "schedule_period_id, ScheduleId, PeriodId, SubjectId, TitleId, ProviderId, CourseId, course_type, custom_build_description, tp_provider_name, tp_course_name, tp_phone_number, tp_specific_course_website, tp_additional_specific_course_website, osse_course_name, osse_district_school, osse_school_district_name")',
)
@Entity({ name: 'mth_schedule_period' })
export class SchedulePeriod extends BaseEntity {
  @Column('int', { name: 'schedule_period_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  schedule_period_id: number;

  @Column('int', { name: 'ScheduleId', nullable: true })
  @Field(() => Int, { nullable: true })
  ScheduleId: number;

  @Column('int', { name: 'PeriodId', nullable: true })
  @Field(() => Int, { nullable: true })
  PeriodId: number;

  @Column('int', { name: 'SubjectId', nullable: true })
  @Field(() => Int, { nullable: true })
  SubjectId: number;

  @Column('int', { name: 'TitleId', nullable: true })
  @Field(() => Int, { nullable: true })
  TitleId: number;

  @Column('int', { name: 'ProviderId', nullable: true })
  @Field(() => Int, { nullable: true })
  ProviderId: number;

  @Column('int', { name: 'CourseId', nullable: true })
  @Field(() => Int, { nullable: true })
  CourseId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  course_type: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  custom_build_description: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  tp_provider_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  tp_course_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  tp_phone_number: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  tp_specific_course_website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  tp_additional_specific_course_website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_course_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_district_school: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_school_district_name: string;

  @Column({
    type: 'enum',
    enum: SchedulePeriodStatus,
    comment: 'UPDATE_REQUESTED: Update Requested by Parent, UPDATE_REQUIRED: Update Required by Admin',
    default: null,
  })
  @Field(() => SchedulePeriodStatus, { nullable: true })
  status: SchedulePeriodStatus;

  @ManyToOne(() => Schedule, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ScheduleId', referencedColumnName: 'schedule_id' }])
  @Field(() => Schedule, { nullable: true })
  Schedule: Schedule;

  @ManyToOne(() => Period, (period) => period.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PeriodId', referencedColumnName: 'id' }])
  @Field(() => Period, { nullable: true })
  Period: Period;

  @ManyToOne(() => Subject, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SubjectId', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  Subject: Subject;

  @ManyToOne(() => Title, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'TitleId', referencedColumnName: 'title_id' }])
  @Field(() => Title, { nullable: true })
  Title: Title;

  @ManyToOne(() => Provider, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ProviderId', referencedColumnName: 'id' }])
  Provider: Provider;

  @ManyToOne(() => Course, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'CourseId', referencedColumnName: 'id' }])
  Course: Course;
}
