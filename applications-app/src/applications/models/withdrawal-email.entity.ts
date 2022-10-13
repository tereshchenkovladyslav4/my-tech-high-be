import { Directive, Field, ID, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';

@InputType('withdrawal_email')
@ObjectType()
@Directive('@key(fields: "withdrawal_email_id, withdrawal_id, subject, body, from_email, created_at")')
@Entity('mth_withdrawal_email')
export class WithdrawalEmail extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  withdrawal_email_id?: number;

  @Column('int', { name: 'withdrawal_id', nullable: true })
  @Field(() => Int, { nullable: true })
  withdrawal_id?: number;

  @Column()
  @Field(() => String)
  subject: string;

  @Column('text', { name: 'body', nullable: true })
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne(() => Withdrawal, (withdrawal) => withdrawal.withdrawalEmails, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'withdrawal_id',
    referencedColumnName: 'withdrawal_id',
  })
  @Field(() => Withdrawal, { nullable: true })
  Withdrawal: Withdrawal;
}
