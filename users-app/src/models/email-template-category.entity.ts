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
  OneToMany,
} from 'typeorm';
import { EmailTemplate } from './email-template.entity';
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'email_category' })
export class EmailTemplateCategory extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  category_name: string;

  @OneToMany(
    (type) => EmailTemplate,
    (email_template) => email_template.category,
  )
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'category_id',
  })
  email_templates: EmailTemplate[];
}
