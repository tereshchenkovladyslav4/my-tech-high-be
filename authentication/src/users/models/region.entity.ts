import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserRegion } from './user-region.entity'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, name, program, enrollment_packet_deadline_num_days, region")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  name: string

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  program: string

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  enrollment_packet_deadline_num_days: number;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field((type) => UserRegion, { nullable: true })
  @Directive('@external')
  region: UserRegion;
}
