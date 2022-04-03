import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationRegion } from './region.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'user_region' })
export class ApplicationUserRegion extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  user_id: number;

  @ManyToOne(() => ApplicationRegion, (region) => region.region, {
    onDelete: 'CASCADE',
  })
  @Field(() => ApplicationRegion, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  regionDetail: ApplicationRegion;

  @ManyToOne(() => User, (user) => user.userRegions, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
