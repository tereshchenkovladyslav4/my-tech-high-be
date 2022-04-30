import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from './application.entity';

@ObjectType()
@Directive('@key(fields: "application_email_id")')
@Entity('mth_application_email')
export class ApplicationEmail extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  application_email_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  application_id?: number;

  @Column()
  @Field(() => String)
  subject: string;

  @Column()
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne((type) => Application)
  @JoinColumn({
    name: 'application_id',
    referencedColumnName: 'application_id',
  })
  application: Application;
}
