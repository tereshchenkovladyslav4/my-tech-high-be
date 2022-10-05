import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "student_id")')
@Entity('mth_student_status')
export class StudentStatus {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Field(() => Int)
  @PrimaryColumn()
  school_year_id?: number;

  @Field(() => Int)
  @Column({ comment: 'PENDING = 0, ACTIVE = 1, WITHDRAWN = 2, GRADUATED = 3, APPLIED = 5' })
  status?: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date_updated?: Date;

  @ManyToOne((type) => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;
}
