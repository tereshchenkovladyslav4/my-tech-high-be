import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Region } from './region.entity';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive(
  '@key(fields: "school_partner_id , name, abbreviation, photo, active, region_id, region, schoolYear, school_year_id")',
)
@Entity('school_partner')
export class SchoolPartner extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  school_partner_id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  abbreviation: string;

  @Column()
  @Field(() => String, { nullable: true })
  photo?: string;

  @Column()
  @Field(() => Number)
  active: number;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field(() => Int, { nullable: true })
  school_year_id: number;

  @OneToOne(() => Region, (region) => region.id)
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'region_id', referencedColumnName: 'id' })
  region: Region;

  @ManyToOne(() => SchoolYear, (schoolYear) => schoolYear.school_year_id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'school_year_id', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  schoolYear: SchoolYear;
}
