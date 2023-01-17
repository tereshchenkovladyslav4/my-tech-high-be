import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { IsIn } from 'class-validator';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';
import { SchedulePeriodHistory } from './schedule-period-history.entity';

@InputType('schedule_history')
@ObjectType()
@Directive('@key(fields: "schedule_history_id, StudentId, SchoolYearId, status, date_accepted, is_second_semester")')
@Entity({ name: 'mth_schedule_history' })
export class ScheduleHistory extends BaseEntity {
  @Column('int', { name: 'schedule_history_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  schedule_history_id: number;

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
  @Field(() => Boolean, { nullable: true })
  is_second_semester: boolean;

  @Column({ nullable: true })
  @Field(() => Date, { nullable: true })
  date_accepted: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.ScheduleHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;

  @ManyToOne(() => Student, (student) => student.ScheduleHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @Field(() => Student, { nullable: true })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  ScheduleStudent: Student;

  @OneToMany(() => SchedulePeriodHistory, (SchedulePeriod) => SchedulePeriod.ScheduleHistory)
  @Field(() => [SchedulePeriodHistory], { nullable: true })
  SchedulePeriodHistories: SchedulePeriodHistory[];
}
