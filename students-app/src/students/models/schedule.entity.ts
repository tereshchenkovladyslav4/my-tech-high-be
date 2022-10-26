import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { IsIn } from 'class-validator';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "schedule_id, StudentId, SchoolYearId, status, date_accepted, last_modified, date_submitted, current_submission")',
)
@Entity('mth_schedule')
export class Schedule extends BaseEntity {
  @Column('int', { name: 'schedule_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  schedule_id: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  StudentId: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn(['Draft', 'Submitted', 'Accepted', ''])
  @Directive('@external')
  status: string;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_accepted: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  last_modified: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_submitted: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  current_submission: Date;

  // @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.Schedules)
  // @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  // @Directive('@external')
  // SchoolYear: SchoolYear;

  @ManyToOne(() => Student, (student) => student.StudentSchedules)
  @JoinColumn([{ name: 'StudentId', referencedColumnName: 'student_id' }])
  Student: Student;
}
