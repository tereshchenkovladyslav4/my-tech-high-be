import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from './subject.entity';
import { Title } from './title.entity';
import { Provider } from './provider.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, provider_id, name, min_grade, max_grade, min_alt_grade, max_alt_grade, always_unlock, software_reimbursement, display_notification, course_notification, launchpad_course, course_id, website, diploma_seeking_path, limit, reduce_funds, price, reduce_funds_notification, subject_id, allow_request, is_active, deleted, Provider, Subject, Titles, SchedulePeriods, SchedulePeriodHistories")',
)
@Entity('mth_course')
export class Course {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  provider_id?: number;

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

  @Column('tinyint', { name: 'always_unlock', default: false })
  @Field(() => Boolean, { nullable: true })
  always_unlock: boolean;

  @Column('tinyint', { name: 'software_reimbursement', default: false })
  @Field(() => Boolean, { nullable: true })
  software_reimbursement: boolean;

  @Column('tinyint', { name: 'display_notification', default: false })
  @Field(() => Boolean, { nullable: true })
  display_notification: boolean;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  course_notification: string;

  @Column('tinyint', { name: 'launchpad_course', default: false })
  @Field(() => Boolean, { nullable: true })
  launchpad_course: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  course_id?: string;

  @Column()
  @Field(() => String, { nullable: true })
  website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  diploma_seeking_path: string;

  @Column('int', { name: 'limit', nullable: true })
  @Field(() => Int, { nullable: true })
  limit: number | null;

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

  @Column()
  @Field(() => ID, { nullable: true })
  subject_id?: number;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  allow_request: boolean;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  deleted: boolean;

  @ManyToOne(() => Provider, (provider) => provider.Courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'provider_id', referencedColumnName: 'id' }])
  @Field(() => Provider, { nullable: true })
  Provider: Provider;

  @ManyToOne(() => Subject, (subject) => subject.Courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'subject_id', referencedColumnName: 'subject_id' }])
  @Field(() => Subject, { nullable: true })
  Subject: Subject;

  @ManyToMany(() => Title, (title) => title.Courses)
  @JoinTable({
    name: 'mth_course_title',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'title_id', referencedColumnName: 'title_id' },
  })
  @Field(() => [Title], { nullable: true })
  Titles: Title[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Course)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];

  @OneToMany(() => SchedulePeriodHistory, (schedulePeriodHistory) => schedulePeriodHistory.Course)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
