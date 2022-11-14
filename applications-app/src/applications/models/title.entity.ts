import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToMany, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Course } from './course.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@ObjectType()
@Directive(
  '@key(fields: "title_id, subject_id, name, min_grade, max_grade, min_alt_grade, max_alt_grade, diploma_seeking_path, reduce_funds, price, reduce_funds_notification, custom_built_description, subject_notification, always_unlock, custom_built, third_party_provider, split_enrollment, software_reimbursement, display_notification, launchpad_course, course_id, state_course_codes, allow_request, is_active, deleted, Subject, Courses")',
)
@Entity('mth_title')
export class Title {
  @Column('int', { name: 'title_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  title_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  subject_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  min_grade: number;

  @Column()
  @Field(() => Int, { nullable: true })
  max_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  min_alt_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  max_alt_grade: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  diploma_seeking_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  reduce_funds: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  price: number | null;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  reduce_funds_notification: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  custom_built_description: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  subject_notification: string;

  @Column('tinyint', { name: 'always_unlock', default: false })
  @Field(() => Boolean, { nullable: true })
  always_unlock: boolean;

  @Column('tinyint', { name: 'custom_built', default: false })
  @Field(() => Boolean, { nullable: true })
  custom_built: boolean;

  @Column('tinyint', { name: 'third_party_provider', default: false })
  @Field(() => Boolean, { nullable: true })
  third_party_provider: boolean;

  @Column('tinyint', { name: 'split_enrollment', default: false })
  @Field(() => Boolean, { nullable: true })
  split_enrollment: boolean;

  @Column('tinyint', { name: 'software_reimbursement', default: false })
  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;

  @Column('tinyint', { name: 'display_notification', default: false })
  @Field(() => Boolean, { nullable: true })
  display_notification: boolean;

  @Column('tinyint', { name: 'launchpad_course', default: false })
  @Field(() => Boolean, { nullable: true })
  launchpad_course: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  course_id?: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  state_course_codes: string;

  @Column('int', { name: 'priority', nullable: true })
  @Field(() => Int, { nullable: true })
  priority: number | null;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @ManyToOne(() => Subject, (subject) => subject.Titles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subject_id', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  Subject: Subject;

  @ManyToMany(() => Course, (course) => course.Titles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => [Course], { nullable: true })
  Courses: Course[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Title)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];

  @OneToMany(() => SchedulePeriodHistory, (schedulePeriodHistory) => schedulePeriodHistory.Title)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
