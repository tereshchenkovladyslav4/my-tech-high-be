import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { IsIn } from 'class-validator';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';
import { SchedulePeriod } from './schedule-period.entity';

@InputType('schedule')
@ObjectType()
@Directive(
  '@key(fields: "schedule_id, StudentId, SchoolYearId, status, date_accepted, last_modified, date_submitted, current_submission")',
)
@Entity({ name: 'mth_schedule' })
export class Schedule extends BaseEntity {
  @Column('int', { name: 'schedule_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @IsIn(['Draft', 'Submitted', 'Accepted', 'Resubmitted'])
  status: string;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_accepted: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  last_modified: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_submitted: Date;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  current_submission: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Schedules)
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;

  @ManyToOne(() => Student, (student) => student.Schedules)
  @JoinColumn([{ name: 'StudentId', referencedColumnName: 'student_id' }])
  ScheduleStudent: Student;

  @OneToMany(() => SchedulePeriod, (schedulePeriod) => schedulePeriod.Schedule)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];
}
