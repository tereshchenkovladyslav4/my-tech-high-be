import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRegion } from './user-region.entity';
import { SchoolYear } from './schoolyear.entity';
import { County } from './county.entity';
import { SchoolDistrict } from './school-district.entity';
import { EmailTemplate } from './email-template.entity';

@ObjectType()
@Directive('@key(fields: "id,name, program, state_logo, enrollment_packet_deadline_num_days, region")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  program: string;

  @Column()
  @Field(() => String, { nullable: true })
  state_logo: string;

  @Column()
  @Field(() => String, { nullable: true })
  county_file_name: string;

  @Column()
  @Field(() => String, { nullable: true })
  county_file_path: string;

  @Column()
  @Field(() => String, { nullable: true })
  school_district_file_name: string;

  @Column()
  @Field(() => String, { nullable: true })
  school_district_file_path: string;

  @Column()
  @Field(() => Int, { nullable: true })
  application_deadline_num_days: number;

  @Column()
  @Field(() => Int, { nullable: true })
  enrollment_packet_deadline_num_days: number;

  @Column()
  @Field(() => Int, { nullable: true })
  withdraw_deadline_num_days: number;

  @Column('text', { nullable: true })
  @Field(() => String, { nullable: true })
  resource_confirm_details: string;

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field(() => UserRegion, { nullable: true })
  region: UserRegion;

  @OneToMany(() => County, (county) => county.Region)
  @Field(() => County, { nullable: true })
  Counties: County[];

  @OneToMany(() => SchoolDistrict, (schoolDistrict) => schoolDistrict.Region)
  @Field(() => SchoolDistrict, { nullable: true })
  SchoolDistricts: SchoolDistrict[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => SchoolYear, (schoolYear) => schoolYear.Region)
  @Field(() => [SchoolYear], { nullable: true })
  SchoolYears: SchoolYear[];

  @OneToMany(() => EmailTemplate, (emailTemplate) => emailTemplate.region)
  @Field(() => [EmailTemplate], { nullable: true })
  email_templates: EmailTemplate[];
}
