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
import { Region } from './region.entity';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id,region_id,user_id, regionDetail, user")')
@Entity({ name: 'user_region' })
export class UserRegion extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  user_id: number;

  @ManyToOne(() => Region, (region) => region.region, { onDelete: 'CASCADE' })
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  regionDetail: Region;

  @ManyToOne(() => User, (user) => user.userRegion, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
