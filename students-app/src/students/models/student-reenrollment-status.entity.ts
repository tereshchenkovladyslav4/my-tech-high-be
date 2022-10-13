import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "student_id")')
@Entity('mth_student_reenrollment_status')
export class StudentReenrollmentStatus {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Field(() => Int)
  @PrimaryColumn()
  school_year_id?: number;

  @Field(() => Int)
  @Column()
  reenrolled?: number;
}
