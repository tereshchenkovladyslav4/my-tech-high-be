import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType('question')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_question' })
export class Question extends BaseEntity {
  @Column()
  @Field((type) => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  section: string;

  @Column()
  @Field((type) => String, { nullable: true })
  slug: string;

  @Column()
  @Field(() => Int, { nullable: true })
  type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  sequence?: number;
  
  @Column()
  @Field((type) => String, { nullable: true })
  question: String;

  @Column()
  @Field((type) => String, { nullable: true })
  options: String;

  @Column()
  @Field((type) => Int, { nullable: true })
  validation: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  mainQuestion: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  defaultQuestion: number;

  @Column()
  @Field((type) => String, { nullable: true })
  additionalQuestion: String;

  @Column()
  @Field(() => Int, { nullable: true })
  required?: number;
}
