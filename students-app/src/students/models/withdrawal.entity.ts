import { Directive, Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsIn, IsInt } from 'class-validator';
import { Column, Entity, ManyToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Student } from './student.entity';
import { WithdrawalEmail } from './withdrawal-email.entity';

export const WITHDRAWAL_TABLE_NAME = 'withdrawal';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "withdrawal_id, application_id, StudentId, school_year_id, status, soe, funding, date, date_effective, date_emailed, response, grade_level, student_name")',
)
@Entity({ name: 'withdrawal' })
export class Withdrawal extends BaseEntity {
  //	Auto increment withdrawal ID
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'withdrawal_id' })
  @Directive('@external')
  withdrawal_id?: number;

  //	student id
  @Column('int', { name: 'application_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  application_id?: number;

  //	student id
  @Column('int', { name: 'StudentId', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  StudentId?: number;

  @Column('int', { name: 'school_year_id', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  school_year_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  status?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  soe?: string;

  @Column()
  @Field(() => Boolean, { nullable: true })
  @Directive('@external')
  funding?: boolean;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_effective?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  date_emailed?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  response?: string;

  //////////////	For response	//////////////
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grade_level: string;

  @Field(() => String, { nullable: true })
  @Directive('@external')
  student_name: string;

  @ManyToOne(() => Student, (student) => student.StudentWithdrawals, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'StudentId', referencedColumnName: 'student_id' })
  Student: Student;
}
