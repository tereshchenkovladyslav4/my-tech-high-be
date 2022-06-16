import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { WithdrawalEmail } from './withdrawal-email.entity';

@ObjectType()
@Entity('withdrawal')
export class Withdrawal extends BaseEntity {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'withdrawal_id' })
  withdrawal_id?: number;

  @Field((type) => Int, { nullable: true })
  @Column('int', { name: 'StudentId', nullable: true })
  StudentId: number | null;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  soe?: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  funding?: boolean;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  date?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  date_effective?: Date;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  date_emailed?: Date;

  @ManyToOne(() => Student, (student) => student.Withdrawals, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  @Field(() => Student, { nullable: true })
  Student: Student;

  @OneToMany(
    () => WithdrawalEmail,
    (withdrawalEmail) => withdrawalEmail.Withdrawal,
  )
  @Field(() => [WithdrawalEmail], { nullable: true })
  WithdrawalEmails: WithdrawalEmail[];
}
