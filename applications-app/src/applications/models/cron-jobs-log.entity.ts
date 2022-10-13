import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "log_id")')
@Entity('cron_jobs_logs')
export class CronJobsLog extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  function_name: string;

  @Column()
  @Field((type) => String, { nullable: true })
  type: string;

  @Column()
  @Field((type) => String, { nullable: true })
  log: string;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  created_at?: Date;
}
