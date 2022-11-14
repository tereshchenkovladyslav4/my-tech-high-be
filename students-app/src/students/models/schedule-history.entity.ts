import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { IsIn } from 'class-validator';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "schedule_history_id, StudentId, SchoolYearId, status, date_accepted, is_second_semester")')
@Entity('mth_schedule_history')
export class ScheduleHistory extends BaseEntity {
  @Column('int', { name: 'schedule_history_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  schedule_history_id: number;

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

  @ManyToOne(() => Student, (student) => student.StudentScheduleHistories, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'StudentId', referencedColumnName: 'student_id' }])
  Student: Student;
}
