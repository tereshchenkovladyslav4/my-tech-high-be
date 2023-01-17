import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EmailTemplate } from './email-template.entity';
@ObjectType()
@Directive('@key(fields: "category_id")')
@Entity({ name: 'email_category' })
export class EmailTemplateCategory extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  category_name: string;

  @OneToMany(() => EmailTemplate, (emailTemplate) => emailTemplate.category)
  @Field(() => [EmailTemplate], { nullable: true })
  email_templates: EmailTemplate[];
}
