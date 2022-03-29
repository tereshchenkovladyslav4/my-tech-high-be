import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EmailTemplateCategory } from './email-template-category.entity';
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

  // @Column()
  // @Field((type) => String, { nullable: true })
  // notes: string;

  @Column()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @ManyToOne((type) => EmailTemplateCategory, { nullable: true })
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'category_id',
  })
  category?: EmailTemplateCategory;
}
