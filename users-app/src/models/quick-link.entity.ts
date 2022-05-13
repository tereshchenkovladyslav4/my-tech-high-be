import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType('quickLink')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_quick_link' })
export class QuickLink extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => Int, { nullable: true, defaultValue: 1 })
  region_id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  title: string;

  @Column()
  @Field((type) => String, { nullable: true })
  subtitle: string;

  @Column()
  @Field((type) => String, { nullable: true })
  image_url: string;

  @Column()
  @Field(() => Int, { nullable: true })
  type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  sequence?: number;
  
  @Column()
  @Field((type) => String, { nullable: true, defaultValue: '' })
  reserved: String;

  @Column()
  @Field(() => Int, { nullable: true })
  flag?: number;
}
