import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity, OneToMany } from 'typeorm';
import { IsIn } from 'class-validator';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';
import { SchedulePeriod } from './schedule-period.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "schedule_id, StudentId, SchoolYearId, status, date_accepted, last_modified, date_submitted, current_submission, is_second_semester, SchedulePeriods")',
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

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  is_second_semester: boolean;

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

  @ManyToOne(() => Student, (student) => student.StudentSchedules, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'StudentId', referencedColumnName: 'student_id' }])
  Student: Student;

  @OneToMany(() => SchedulePeriod, (SchedulePeriod) => SchedulePeriod.Schedule)
  @Field(() => [SchedulePeriod], { nullable: true })
  @Directive('@external')
  SchedulePeriods: SchedulePeriod[];
}
