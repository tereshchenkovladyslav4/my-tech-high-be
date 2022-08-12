import { Directive, Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "student_id, school_year_id")')
@Entity({ name: 'mth_student_grade_level' })
export class StudentGradeLevel extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number

  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  school_year_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  grade_level: string;

  @Field((type) => SchoolYear)
  school_year?: SchoolYear

  @ManyToOne((type) => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;
}
