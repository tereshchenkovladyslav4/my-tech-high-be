import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ApplicationUserRegion } from './user-region.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'region' })
export class ApplicationRegion extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  name: string;

  @ManyToOne(
    () => ApplicationUserRegion,
    (userRegion) => userRegion.regionDetail,
  )
  @Field(() => ApplicationUserRegion, { nullable: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'region_id' })
  region: ApplicationUserRegion;
}
