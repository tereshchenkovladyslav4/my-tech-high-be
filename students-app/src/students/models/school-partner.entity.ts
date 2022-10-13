import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Region } from './region.entity';
import { SchoolEnrollment } from './school-enrollment.entity';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@extends')
@Directive(
  '@key(fields: "school_partner_id , name, abbreviation, photo, active, region_id, region, schoolYear, school_year_id")',
)
@Entity('school_partner')
export class SchoolPartner extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Directive('@external')
  school_partner_id: number;

  @Column()
  @Field(() => String)
  @Directive('@external')
  name: string;

  @Column()
  @Field(() => String)
  @Directive('@external')
  abbreviation: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  photo?: string;

  @Column()
  @Field(() => Number)
  @Directive('@external')
  active: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  region_id: number;

  @Column()
  @Field((type) => Int, { nullable: true })
  @Directive('@external')
  school_year_id: number;

  @OneToOne(() => Region, (region) => region.id)
  @Field(() => Region, { nullable: true })
  @Directive('@external')
  @JoinColumn({ name: 'region_id', referencedColumnName: 'id' })
  region: Region;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.school_year_id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'school_year_id', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  @Directive('@external')
  schoolYear: SchoolYear;

  @OneToMany(() => SchoolEnrollment, (soe) => soe.partner)
  @JoinColumn({ name: 'school_partner_id', referencedColumnName: 'school_partner_id' })
  @Field(() => [SchoolEnrollment], { nullable: true })
  schoolEnrollment: SchoolEnrollment[];
}
