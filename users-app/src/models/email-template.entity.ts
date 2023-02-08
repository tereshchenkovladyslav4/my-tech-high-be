import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EmailTemplateCategory } from './email-template-category.entity';
import { Region } from './region.entity';
@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'email_templates' })
export class EmailTemplate extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Number)
  school_year_id?: number;

  @Column()
  @Field(() => Boolean)
  mid_year?: boolean;

  @Column()
  @Field(() => String)
  template_name: string;

  @Column()
  @Field(() => String, { nullable: true })
  title: string;

  @Column()
  @Field(() => String, { nullable: true })
  subject: string;

  @Column()
  @Field(() => String, { nullable: true })
  from: string;

  @Column()
  @Field(() => String, { nullable: true })
  bcc: string;

  @Column()
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true, defaultValue: '' })
  standard_responses: string;

  @Column()
  @Field(() => Int, { nullable: true })
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
  @Field(() => String, { nullable: true, defaultValue: '' })
  template: string;

  @Column()
  @Field(() => String, { nullable: true, defaultValue: '' })
  inserts: string;

  @Column()
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  region_id: number;

  @ManyToOne(() => Region, (region) => region.email_templates, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'region_id', referencedColumnName: 'id' }])
  @Field(() => Region, { nullable: true })
  region: Region;
}
