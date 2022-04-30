import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRegion } from './user-region.entity';
import { RegionProgram } from './region-program.enum';
import { SchoolYear } from './schoolyear.entity';
import { County } from './county.entity';
import { SchoolDistrict } from './school-district.entity';

@ObjectType()
@Directive('@key(fields: "id,name, program")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  name: string;

  @Column()
  @Field((type) => String, { nullable: true })
  program: String;

  @Column()
  @Field((type) => String, { nullable: true })
  state_logo: String;

  @Column()
  @Field((type) => String, { nullable: true })
  county_file_name: String;

  @Column()
  @Field((type) => String, { nullable: true })
  county_file_path: String;

  @Column()
  @Field((type) => String, { nullable: true })
  school_district_file_name: String;

  @Column()
  @Field((type) => String, { nullable: true })
  school_district_file_path: String;

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
}
