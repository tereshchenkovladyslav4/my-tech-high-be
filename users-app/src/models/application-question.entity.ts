import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_application_question')
export class ApplicationQuestion extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field(() => Int)
  type: number;

  @Column()
  @Field(() => Int)
  school_year_id: number;

  @Column()
  @Field(() => Boolean)
  mid_year: boolean;

  @Column()
  @Field(() => Int, { defaultValue: 0 })
  order: number;

  @Column()
  @Field(() => String, { nullable: true })
  question?: string;

  @Column()
  @Field(() => String, { nullable: true })
  options?: string;

  @Column()
  @Field(() => Boolean, { defaultValue: true })
  required: boolean;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id?: number;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  default_question: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: false })
  student_question: boolean;

  @Column()
  @Field(() => Int, { defaultValue: 0 })
  validation: number;

  @Column()
  @Field(() => String, { nullable: true })
  slug?: string;

  @Column()
  @Field(() => Int, { nullable: false })
  main_question?: number;

  @Column()
  @Field(() => String, { nullable: true })
  additional_question?: string;
}
