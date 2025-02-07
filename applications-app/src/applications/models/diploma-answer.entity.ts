import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id, school_year_id, student_id, answer, grade")')
@Entity('mth_diploma_answer')
export class DiplomaAnswer extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Field(() => Int)
  school_year_id: number;

  @Column()
  @Field(() => Int)
  student_id: number;

  @Column()
  @Field(() => Int)
  answer: number;

  @Column()
  @Field(() => String, { nullable: true })
  grade?: string;
}
