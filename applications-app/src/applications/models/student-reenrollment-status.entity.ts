import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "student_id")')
@Entity('mth_student_reenrollment_status')
export class StudentReenrollmentStatus {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  @Directive('@external')
  student_id?: number;

  @Field(() => Int)
  @PrimaryColumn()
  @Directive('@external')
  school_year_id?: number;

  @Field(() => Int)
  @Column()
  @Directive('@external')
  reenrolled?: number;

  @ManyToOne((type) => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;
}
