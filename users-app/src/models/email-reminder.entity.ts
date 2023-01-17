import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EmailTemplate } from './email-template.entity';

@ObjectType()
@Directive('@key(fields: "reminder_id")')
@Entity({ name: 'email_reminder' })
export class EmailReminder extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  reminder_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  title: string;

  @Column()
  @Field(() => String, { nullable: true })
  subject: string;

  @Column()
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => Int, { nullable: true })
  reminder: number;

  @Column()
  @Field(() => Int, { nullable: true })
  email_template_id: number;

  @ManyToOne(() => EmailTemplate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email_template_id', referencedColumnName: 'id' })
  email_template?: EmailTemplate;
}
