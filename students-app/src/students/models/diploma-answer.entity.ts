import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, school_year_id, student_id, answer, grade")')
@Entity('mth_diploma_answer')
export class DiplomaAnswer extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  @Directive('@external')
  id: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  school_year_id: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  student_id: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  answer: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grade?: string;
}
