import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Period } from './period.entity';
import { Subject } from './subject.entity';
import { Title } from './title.entity';
import { Provider } from './provider.entity';
import { Course } from './course.entity';
import { ScheduleHistory } from './schedule-history.entity';

@InputType('schedule_period_history')
@ObjectType()
@Directive(
  '@key(fields: "schedule_period_history_id, ScheduleHistoryId, PeriodId, SubjectId, TitleId, ProviderId, CourseId, course_type, custom_build_description, tp_provider_name, tp_course_name, tp_phone_number, tp_specific_course_website, tp_addtional_specific_course_website, osse_coures_name, osse_district_school, osse_school_district_name")',
)
@Entity({ name: 'mth_schedule_period_history' })
export class SchedulePeriodHistory extends BaseEntity {
  @Column('int', { name: 'schedule_period_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  schedule_period_history_id: number;

  @Column('int', { name: 'ScheduleHistoryId', nullable: true })
  @Field(() => Int, { nullable: true })
  ScheduleHistoryId: number;

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

  @Column({ nullable: true })
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
  tp_addtional_specific_course_website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_coures_name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_district_school: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  osse_school_district_name: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  update_required: boolean;

  @ManyToOne(() => ScheduleHistory, (schedule) => schedule.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ScheduleHistoryId', referencedColumnName: 'schedule_history_id' }])
  @Field(() => ScheduleHistory, { nullable: true })
  ScheduleHistory: ScheduleHistory;

  @ManyToOne(() => Period, (period) => period.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PeriodId', referencedColumnName: 'id' }])
  Period: Period;

  @ManyToOne(() => Subject, (schedule) => schedule.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SubjectId', referencedColumnName: 'subject_id' }])
  Subject: Subject;

  @ManyToOne(() => Title, (schedule) => schedule.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'TitleId', referencedColumnName: 'title_id' }])
  Title: Title;

  @ManyToOne(() => Provider, (schedule) => schedule.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ProviderId', referencedColumnName: 'id' }])
  Provider: Provider;

  @ManyToOne(() => Course, (schedule) => schedule.SchedulePeriodHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'CourseId', referencedColumnName: 'id' }])
  Course: Course;
}
