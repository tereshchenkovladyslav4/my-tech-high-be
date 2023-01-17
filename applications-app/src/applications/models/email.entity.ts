import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { Column, PrimaryColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "name, category")')
export class Email extends BaseEntity {
  @Column()
  @Field(() => String, { nullable: true })
  @PrimaryColumn()
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @PrimaryColumn()
  category?: string;

  @Column()
  @Field(() => String, { nullable: true })
  title?: string;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

  @Column()
  @Field(() => String, { nullable: true })
  value?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  user_changeable?: number;

  @Column()
  @Field(() => Date, { nullable: true })
  date_changed?: Date;
}
