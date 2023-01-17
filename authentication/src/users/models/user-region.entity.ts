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
@Directive('@extends')
@Directive('@key(fields: "id,region_id,user_id, regionDetail, user")')
@Entity({ name: 'user_region' })
export class UserRegion extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  region_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  user_id: number;

  @ManyToOne(() => Region, (region) => region.region, { onDelete: 'CASCADE' })
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id' })
  @Directive('@external')
  regionDetail: Region;

  @ManyToOne(() => User, (user) => user.userRegion, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  @Directive('@external')
  user: User;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
