import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@InputType('quickLink')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_quick_link' })
export class QuickLink extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  title: string;

  @Column()
  @Field(() => String, { nullable: true })
  subtitle: string;

  @Column()
  @Field(() => String, { nullable: true })
  image_url: string;

  @Column()
  @Field(() => Int, { nullable: true })
  type?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  sequence?: number;

  @Column()
  @Field(() => String, { nullable: true })
  reserved: string;

  @Column()
  @Field(() => Int, { nullable: true })
  flag?: number;
}
