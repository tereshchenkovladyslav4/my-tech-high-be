import { Directive, Field, ObjectType, Int, InputType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { EmailRecord } from './email-record.entity';
import { ReimbursementRequest } from './reimbursement-request.entity';

@InputType('reimbursement_request_email')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_reimbursement_request_email')
export class ReimbursementRequestEmail extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  reimbursement_request_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  email_record_id?: number;

  @Column()
  @Field(() => String)
  subject: string;

  @Column('text', { name: 'body', nullable: true })
  @Field(() => String, { nullable: true })
  body: string;

  @Column()
  @Field(() => String, { nullable: true })
  from_email: string;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne(() => ReimbursementRequest, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'reimbursement_request_id', referencedColumnName: 'reimbursement_request_id' })
  @Field(() => ReimbursementRequest, { nullable: true })
  ReimbursementRequest: ReimbursementRequest;

  @OneToOne(() => EmailRecord)
  @JoinColumn({ name: 'email_record_id', referencedColumnName: 'id' })
  @Field(() => EmailRecord, { nullable: true })
  EmailRecord: EmailRecord;
}
