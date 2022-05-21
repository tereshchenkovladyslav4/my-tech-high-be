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
  OneToMany,
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { ApplicationUserRegion } from './user-region.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'region' })
export class ApplicationRegion extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
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

  @OneToMany(() => Announcement, (announcement) => announcement.Region)
  @Field(() => [Announcement], { nullable: true })
  Announcements: Announcement[];
}
