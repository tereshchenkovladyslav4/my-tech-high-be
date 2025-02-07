import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@InputType('email_records')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_email_records')
export class EmailRecord extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @Column()
  @Field(() => String)
  to_email: string;

  @Column()
  @Field(() => String)
  subject: string;

  @Column()
  @Field(() => String)
  template_name: string;

  @Column()
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  region_id: number;

  @Column()
  @Field(() => String)
  bcc: string;

  @Column()
  @Field(() => String)
  status: string;

  @Column('text', { name: 'body', nullable: true })
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;
}
