import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "student_id")')
@Entity('mth_student_status_history')
export class StudentStatusHistory {
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Field(() => Int)
  @Column()
  school_year_id?: number;

  @Field(() => Int)
  @Column()
  status?: number;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date_updated?: Date;
}
