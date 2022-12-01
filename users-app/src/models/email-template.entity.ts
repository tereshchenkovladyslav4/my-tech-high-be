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
import { Region } from './region.entity';
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
  @Field((type) => String, { nullable: true, defaultValue: '' })
  standard_responses: string;

  @Column()
  @Field((type) => Int, { nullable: true })
  priority: number;

  // @Column()
  // @Field((type) => String, { nullable: true })
  // notes: string;

  @Column()
  @Field(() => Int, { nullable: true })
  category_id?: number;

  @ManyToOne(() => EmailTemplateCategory, (category) => category.email_templates, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'category_id' }])
  @Field(() => EmailTemplateCategory, { nullable: true })
  category: EmailTemplateCategory;

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: '' })
  template: string;

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: '' })
  inserts: string;

  @Column()
  @Field((type) => Int, { nullable: true, defaultValue: 1 })
  region_id: number;

  @ManyToOne(() => Region, (region) => region.email_templates, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'region_id', referencedColumnName: 'id' }])
  @Field(() => Region, { nullable: true })
  region: Region;
}
