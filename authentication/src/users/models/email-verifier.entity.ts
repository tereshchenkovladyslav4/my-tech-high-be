import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import * as Moment from 'moment';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, user_id, email")')
@Entity({ name: 'mth_emailverifier' })
export class EmailVerifier extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  email?: string;

  @Column()
  @Field({ nullable: true, defaultValue: Moment().format('YYYY-MM-DD HH:mm:ss') })
  date_created?: Date;

  @Column()
  @Field({ nullable: true })
  date_verified?: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  verified?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  verification_type?: number;
}
