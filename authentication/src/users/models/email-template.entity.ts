import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'email_templates' })
export class EmailTemplate extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => String)
  template_name: string;

  @Column()
  @Field((type) => String, { nullable: true })
  title: string;

  @Column()
  @Field((type) => String, { nullable: true })
  subject: string;

  @Column()
  @Field((type) => String, { nullable: true })
  from: string;

  @Column()
  @Field((type) => String, { nullable: true })
  bcc: string;

  @Column()
  @Field((type) => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  standard_responses?: string;

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: '' })
  template: string;

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: '' })
  inserts: string;

  @Column()
  @Field((type) => Int, { nullable: true, defaultValue: 1 })
  region_id: number;
}
