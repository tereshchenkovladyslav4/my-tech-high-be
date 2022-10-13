import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';

@InputType('soes')
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, student_id, school_year_id, school_partner_id")')
@Entity({ name: 'mth_school_enrollment' })
export class SchoolEnrollment extends BaseEntity {
  @Column()
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  student_id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  school_year_id?: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  school_partner_id?: number;

  @ManyToOne((type) => Student, (student) => student.schoolEnroll)
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  @Field(() => Student, { nullable: true })
  student: Student;
}
