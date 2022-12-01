import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'email_templates' })
export class ApplicationEmailTemplate extends BaseEntity {
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
  @Field(() => String, { nullable: true })
  template?: string;

  @Column()
  @Field(() => String, { nullable: true })
  inserts?: string;

  @Column()
  @Field(() => Int, { nullable: false })
  region_id?: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  priority: number;
}
