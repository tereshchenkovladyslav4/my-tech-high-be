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
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, AssignmentId, StudentId, AssignmentId, SchoolYearId, status, meta, grade, created_at, updated_at, SchoolYear ")',
)
@Entity('mth_student_learning_log')
export class StudentLearningLog extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column('int', { name: 'SchoolYearId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  SchoolYearId: number;

  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  StudentId: number;

  @Column('int', { name: 'AssignmentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  AssignmentId: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  status: string;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  meta: string;

  @Column('decimal', {
    name: 'grade',
    nullable: true,
    precision: 13,
    scale: 2,
  })
  @Field(() => Float, { nullable: true })
  @Directive('@external')
  grade: number | null;

  @Field(() => Date, { nullable: true })
  @Directive('@external')
  @CreateDateColumn()
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  @Directive('@external')
  updated_at?: Date;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.StudentLearningLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @Field(() => SchoolYear, { nullable: true })
  @JoinColumn([{ name: 'SchoolYearId', referencedColumnName: 'school_year_id' }])
  @Directive('@external')
  SchoolYear: SchoolYear;
}
