import { Field, ObjectType, Int, Directive, InputType, Float } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';

@InputType('studentLearningLog')
@ObjectType()
@Directive(
  '@key(fields: "id, AssignmentId, StudentId, AssignmentId, SchoolYearId, status, meta, grade, created_at, updated_at, SchoolYear ")',
)
@Entity('mth_student_learning_log')
export class StudentLearningLog extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  SchoolYearId: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  StudentId: number;

  @Column('int', { name: 'AssignmentId', nullable: true })
  @Field(() => Int, { nullable: true })
  AssignmentId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  status: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  meta: string;

  @Column('decimal', {
    name: 'grade',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  grade: number | null;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updated_at?: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.StudentLearningLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => SchoolYear, { nullable: true })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  SchoolYear: SchoolYear;

  @ManyToOne(() => Student, (student) => student.StudentLearningLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Student, { nullable: true })
  @JoinColumn([{ name: 'StudentId', referencedColumnName: 'student_id' }])
  Student: Student;

  @ManyToOne(() => Assignment, (assignment) => assignment.StudentLearningLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => Assignment, { nullable: true })
  @JoinColumn([{ name: 'AssignmentId', referencedColumnName: 'id' }])
  Assignment: Assignment;
}
