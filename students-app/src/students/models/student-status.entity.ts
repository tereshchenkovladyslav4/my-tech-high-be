import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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
  @Column()
  status?: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date_updated?: Date;
}
