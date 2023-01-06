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
import { ResourceRequest } from './resource-request.entity';
import { EmailRecord } from './email-record.entity';

@InputType('resource_request_email')
@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_resource_request_email')
export class ResourceRequestEmail extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  resource_request_id?: number;

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

  @ManyToOne(() => ResourceRequest)
  @JoinColumn({ name: 'resource_request_id', referencedColumnName: 'id' })
  @Field(() => ResourceRequest, { nullable: true })
  ResourceRequest: ResourceRequest;

  @OneToOne(() => EmailRecord)
  @JoinColumn({ name: 'email_record_id', referencedColumnName: 'id' })
  @Field(() => EmailRecord, { nullable: true })
  EmailRecord: EmailRecord;
}
