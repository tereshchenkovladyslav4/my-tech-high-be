import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { Course } from './course.entity';
import { Period } from './period.entity';
import { Provider } from './provider.entity';
import { Schedule } from './schedule.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "schedule_period_id, ScheduleId, PeriodId, SubjectId, TitleId, ProviderId, CourseId, course_type, custom_build_description, tp_provider_name, tp_course_name, tp_phone_number, tp_specific_course_website, tp_additional_specific_course_website, osse_course_name, osse_district_school, osse_school_district_name")',
)
@Entity({ name: 'mth_schedule_period' })
export class SchedulePeriod extends BaseEntity {
  @Column('int', { name: 'schedule_period_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  schedule_period_id: number;

  @Column('int', { name: 'ScheduleId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  ScheduleId: number;

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

  @ManyToOne(() => Course, (schedule) => schedule.SchedulePeriods)
  @JoinColumn([{ name: 'CourseId', referencedColumnName: 'id' }])
  @Directive('@external')
  Course: Course;

  @ManyToOne(() => Schedule, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ScheduleId', referencedColumnName: 'schedule_id' }])
  Schedule: Schedule;

  @ManyToOne(() => Period, (period) => period.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'PeriodId', referencedColumnName: 'id' }])
  Period: Period;

  @ManyToOne(() => Provider, (schedule) => schedule.SchedulePeriods, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ProviderId', referencedColumnName: 'id' }])
  @Directive('@external')
  Provider: Provider;
}
