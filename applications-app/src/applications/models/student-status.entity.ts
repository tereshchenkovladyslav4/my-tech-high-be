import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "student_id")')
@Entity('mth_student_status')
export class StudentStatus {
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
  status?: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  @Directive('@external')
  date_updated?: Date;

  @ManyToOne(() => Student, { nullable: true })
  @JoinColumn({ name: 'student_id', referencedColumnName: 'student_id' })
  student?: Student;
}
