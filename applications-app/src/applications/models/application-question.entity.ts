import { Field, ID, ObjectType, Int, Directive } from '@nestjs/graphql';
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
}
