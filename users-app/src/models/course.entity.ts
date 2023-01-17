import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Title } from './title.entity';
import { Provider } from './provider.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, provider_id, name, min_grade, max_grade, min_alt_grade, max_alt_grade, always_unlock, software_reimbursement, display_notification, course_notification, launchpad_course, course_id, website, diploma_seeking_path, limit, reduce_funds, price, reduce_funds_notification, allow_request, is_active, deleted, Provider, Titles, SchedulePeriods, SchedulePeriodHistories")',
)
@Entity('mth_course')
export class Course {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  provider_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  min_grade: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  min_alt_grade: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  max_alt_grade: number;

  @Column('tinyint', { name: 'always_unlock', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  always_unlock: boolean;

  @Column('tinyint', { name: 'software_reimbursement', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  software_reimbursement: boolean;

  @Column('tinyint', { name: 'display_notification', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  display_notification: boolean;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  course_notification: string;

  @Column('tinyint', { name: 'launchpad_course', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  launchpad_course: boolean;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  course_id?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  website: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  diploma_seeking_path: string;

  @Column('int', { name: 'limit', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  limit: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds: string;

  @Column('decimal', {
    name: 'price',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  price: number | null;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  reduce_funds_notification: string;

  @Column('tinyint', { name: 'allow_request', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  allow_request: boolean;

  @Column('tinyint', { name: 'is_active', default: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_active: boolean;

  @Column('tinyint', { name: 'deleted', default: false })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  deleted: boolean;

  @ManyToOne(() => Provider, (provider) => provider.Courses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'provider_id', referencedColumnName: 'id' }])
  @Field(() => Provider, { nullable: true })
  @Directive('@external')
  Provider: Provider;

  @ManyToMany(() => Title, (title) => title.Courses)
  @JoinTable({
    name: 'mth_course_title',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'title_id', referencedColumnName: 'title_id' },
  })
  @Field(() => [Title], { nullable: true })
  @Directive('@external')
  Titles: Title[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Course)
  @Field(() => [SchedulePeriod], { nullable: true })
  @Directive('@external')
  SchedulePeriods: SchedulePeriod[];

  @OneToMany(() => SchedulePeriodHistory, (schedulePeriod) => schedulePeriod.Course)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  @Directive('@external')
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
