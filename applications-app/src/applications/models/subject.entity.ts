import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { SchoolYear } from './schoolyear.entity';
import { Title } from './title.entity';
import { Period } from './period.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@InputType('subject')
@ObjectType()
@Directive(
  '@key(fields: "subject_id, SchoolYearId, name, priority, allow_request, is_active, deleted, Titles, Periods")',
)
@Entity({ name: 'mth_subject' })
export class Subject extends BaseEntity {
  @Column('int', { name: 'subject_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  subject_id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

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

  @ManyToOne(() => SchoolYear, (schoolyear) => schoolyear.Subjects, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @OneToMany(() => Title, (title) => title.Subject)
  @Field(() => [Title], { nullable: true })
  Titles: Title[];

  @ManyToMany(() => Period, (period) => period.Subjects)
  @JoinTable({
    name: 'mth_subject_period',
    joinColumn: { name: 'subject_id', referencedColumnName: 'subject_id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' },
  })
  @Field(() => [Period], { nullable: true })
  Periods: Period[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Subject)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];

  @OneToMany(() => SchedulePeriodHistory, (schedulePeriod) => schedulePeriod.Subject)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
