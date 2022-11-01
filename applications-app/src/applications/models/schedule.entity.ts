import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { IsIn } from 'class-validator';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';
import { SchedulePeriod } from './schedule-period.entity';
import { ScheduleEmail } from './schedule-email.entity';

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

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.schedule)
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;

  @ManyToOne((type) => Student, { nullable: true })
  @Field(() => Student, { nullable: true })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  ScheduleStudent: Student;

  @OneToMany(() => SchedulePeriod, (SchedulePeriod) => SchedulePeriod.Schedule)
  @Field(() => [SchedulePeriod], { nullable: true })
  SchedulePeriods: SchedulePeriod[];

  @OneToMany((type) => ScheduleEmail, (ScheduleEmail) => ScheduleEmail.Schedule)
  @Field(() => [ScheduleEmail], { nullable: true })
  ScheduleEmails: ScheduleEmail[];
  
}
