import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRegion } from './user-region.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, name, program, state_logo, enrollment_packet_deadline_num_days, region")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  program: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  state_logo: string;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  enrollment_packet_deadline_num_days: number;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field(() => UserRegion, { nullable: true })
  @Directive('@external')
  region: UserRegion;
}
