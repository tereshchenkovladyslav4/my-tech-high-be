import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserRegion } from './user-region.entity'
import { RegionProgram } from './region-program.enum'
import { SchoolYear } from './schoolyear.entity'
import { County } from './county.entity'
import { SchoolDistrict } from './school-district.entity'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id,name, program")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  name: string

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  program: String

  @Column()
  state_logo: String

  @Column()
  county_file_name: String

  @Column()
  county_file_path: String

  @Column()
  school_district_file_name: String

  @Column()
  school_district_file_path: String

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  region: UserRegion

  @OneToMany(() => County, (county) => county.Region)
  Counties: County[]

  @OneToMany(() => SchoolDistrict, (schoolDistrict) => schoolDistrict.Region)
  SchoolDistricts: SchoolDistrict[]

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @OneToMany(() => SchoolYear, (schoolYear) => schoolYear.Region)
  SchoolYears: SchoolYear[]
}
