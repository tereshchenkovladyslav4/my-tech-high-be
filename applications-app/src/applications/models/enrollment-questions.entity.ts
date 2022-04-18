import { Field, ID, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
@ObjectType()
@Directive('@key(fields: "id, group_id")')
@Entity('mth_enrollment_questions')
export class EnrollmentQuestions extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  group_id?: number;

  @Column()
  @Field(() => Int)
  type: number;

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
  @Field(() => String, { nullable: true })
  additional?: string;

  @Column()
  @Field(() => String, { nullable: true })
  additional2?: string;

  @Column()
  @Field(() => Boolean, { defaultValue: true })
  required: boolean;

  @Column()
  @Field(() => Boolean, { defaultValue: true })
  removable: boolean;
}
