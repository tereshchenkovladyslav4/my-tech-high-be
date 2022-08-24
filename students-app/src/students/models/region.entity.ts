import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudentRecord } from './student-record.entity';
import { UserRegion } from './user-region.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "id, name, program, state_logo, enrollment_packet_deadline_num_days, region")',
)
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  program: String;

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  state_logo: String;

  @Column()
  application_deadline_num_days: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  enrollment_packet_deadline_num_days: number;

  @Column()
  withdraw_deadline_num_days: number;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field((type) => UserRegion, { nullable: true })
  @Directive('@external')
  region: UserRegion;

  @OneToMany(() => StudentRecord, (record) => record.Region)
  @Field(() => [StudentRecord], { nullable: true })
  Records: StudentRecord[];
}
