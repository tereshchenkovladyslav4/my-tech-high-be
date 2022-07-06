import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Announcement } from './announcement.entity';
import { EventType } from './event-type.entity';
import { ApplicationUserRegion } from './user-region.entity';
import { SchoolYear } from './schoolyear.entity';

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

  @Column()
  @Field((type) => Int, { nullable: true })
  enrollment_packet_deadline_num_days: number;

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

  @OneToMany(() => EventType, (eventType) => eventType.Region)
  @Field(() => [EventType], { nullable: true })
  EventTypes: EventType[];

  @OneToMany(() => SchoolYear, (schoolYear) => schoolYear.region)
  schoolYears: SchoolYear[];
}
