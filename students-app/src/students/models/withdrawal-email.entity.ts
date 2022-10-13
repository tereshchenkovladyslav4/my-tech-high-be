import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "withdrawal_email_id, withdrawal_id, subject, body, from_email, created_at")')
@Entity('mth_withdrawal_email')
export class WithdrawalEmail extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  withdrawal_email_id?: number;

  @Column('int', { name: 'withdrawal_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  withdrawal_id?: number;

  @Column()
  @Field(() => String)
  @Directive('@external')
  subject: string;

  @Column('text', { name: 'body', nullable: true })
  @Field(() => String, { nullable: true })
  @Directive('@external')
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  from_email: string;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  created_at?: Date;
}
