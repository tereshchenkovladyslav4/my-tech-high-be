import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_emailverifier' })
export class EmailVerifier extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsEmail()
  email: string;

  @Column()
  @Field(() => Date, { nullable: true })
  date_created: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_verified: Date;

  @Column()
  @Field(() => Int, { nullable: true })
  verified: number;

  @Column()
  @Field(() => Int, { nullable: true })
  verification_type: number;
}
