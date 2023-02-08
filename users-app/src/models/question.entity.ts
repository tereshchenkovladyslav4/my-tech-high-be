import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('question')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_question' })
export class Question extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id: number;

  @Column()
  @Field(() => Boolean, { nullable: true })
  mid_year: boolean;

  @Column()
  @Field(() => String, { nullable: true })
  section: string;

  @Column()
  @Field(() => String, { nullable: true })
  slug: string;

  @Column()
  @Field(() => Int, { nullable: true })
  type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  sequence?: number;

  @Column()
  @Field(() => String, { nullable: true })
  question: string;

  @Column()
  @Field(() => String, { nullable: true })
  options: string;

  @Column()
  @Field(() => Int, { nullable: true })
  validation: number;

  @Column()
  @Field(() => Int, { nullable: true })
  mainQuestion: number;

  @Column()
  @Field(() => Int, { nullable: true })
  defaultQuestion: number;

  @Column()
  @Field(() => String, { nullable: true })
  additionalQuestion: string;

  @Column()
  @Field(() => Int, { nullable: true })
  required?: number;
}
