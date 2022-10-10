import { Directive, Field, ObjectType, Int } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { Announcement } from './announcement.entity';
import { EventType } from './event-type.entity';
import { UserRegion } from './user-region.entity';
import { SchoolYear } from './schoolyear.entity';
import { ImmunizationSettings } from './immunization-settings.entity';

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

  @ManyToOne(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field(() => UserRegion, { nullable: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'region_id' })
  @Directive('@external')
  region: UserRegion;

  @OneToMany(() => Announcement, (announcement) => announcement.Region)
  @Field(() => [Announcement], { nullable: true })
  Announcements: Announcement[];

  @OneToMany(() => EventType, (eventType) => eventType.Region)
  @Field(() => [EventType], { nullable: true })
  EventTypes: EventType[];

  @OneToMany(() => SchoolYear, (schoolYear) => schoolYear.region)
  schoolYears: SchoolYear[];

  @OneToMany(() => ImmunizationSettings, (immunizationSettings) => immunizationSettings.Region)
  ImmunizationSettings: ImmunizationSettings[];
}
