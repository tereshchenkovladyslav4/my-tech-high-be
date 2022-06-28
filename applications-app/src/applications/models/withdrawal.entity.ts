import {
  Directive,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Student } from './student.entity';
import { WithdrawalEmail } from './withdrawal-email.entity';

export const WITHDRAWAL_TABLE_NAME = 'withdrawal';

@InputType('withdrawal')
@ObjectType()
@Directive('@key(fields: "withdrawal_id")')
@Entity({ name: 'withdrawal' })
export class Withdrawal extends BaseEntity {
  //	Auto increment withdrawal ID
  @Column()
  @Field(() => ID, { nullable: true })
  @IsInt()
  @PrimaryGeneratedColumn({ type: 'int', name: 'withdrawal_id' })
  withdrawal_id?: number;

//	student id
@Column('int', { name: 'application_id', nullable: true })
@Field(() => Int, { nullable: true })
application_id?: number;

//	student id
@Column('int', { name: 'StudentId', nullable: true })
@Field(() => Int, { nullable: true })
StudentId?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @IsIn(['Notified', 'Withdrawn', 'Requested'])
  status?: string;

  @Column()
  @Field(() => String, { nullable: true })
  soe?: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  funding?: boolean;

  @Column()
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_effective?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  date_emailed?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  response?: string;

  //////////////	For response	//////////////
  @Field(() => String, { nullable: true })
  grade_level: string;

	@Field(() => String, { nullable: true })
	student_name: string;

	@ManyToOne(() => Student, (student) => student.withdrawals, {
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
	@Field(() => Student, { nullable: true })
	student: Student;

  @ManyToOne(() => Student, (student) => student.withdrawals, {
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
  withdrawalEmails: WithdrawalEmail[];
}

@ObjectType()
export class WithdrawalPagination {
  @Field((type) => [Withdrawal])
  results?: Withdrawal[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
