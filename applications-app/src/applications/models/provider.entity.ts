import { Directive, Field, Float, Int, ObjectType } from '@nestjs/graphql';
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
import { Period } from './period.entity';
import { Course } from './course.entity';
import { SchedulePeriod } from './schedule-period.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, school_year_id, name, is_display, reduce_funds, price, reduce_funds_notification, multiple_periods, multi_periods_notification, allow_request, is_active, deleted, Courses, Periods")',
)
@Entity({ name: 'mth_provider' })
export class Provider extends BaseEntity {
  @Column('int', { name: 'id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int', { name: 'school_year_id', nullable: true })
  @Field(() => Int, { nullable: true })
  school_year_id: number | null;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column('tinyint', { name: 'is_display' })
  @Field(() => Boolean, { nullable: true })
  is_display: boolean;

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

  @Column('tinyint', { name: 'multiple_periods' })
  @Field(() => Boolean, { nullable: true })
  multiple_periods: boolean;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  multi_periods_notification: string;

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
  @JoinColumn([{ name: 'school_year_id', referencedColumnName: 'school_year_id' }])
  @Field(() => SchoolYear, { nullable: true })
  SchoolYear: SchoolYear;

  @OneToMany(() => Course, (course) => course.Provider)
  @Field(() => [Course], { nullable: true })
  Courses: Course[];

  @ManyToMany(() => Period, (period) => period.Providers)
  @JoinTable({
    name: 'mth_provider_period',
    joinColumn: { name: 'provider_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'period_id', referencedColumnName: 'id' },
  })
  @Field(() => [Period], { nullable: true })
  Periods: Period[];

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Provider)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];
}
