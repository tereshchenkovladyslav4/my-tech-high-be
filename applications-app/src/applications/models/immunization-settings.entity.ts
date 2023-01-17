import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, JoinColumn, ManyToOne } from 'typeorm';
import { Region } from './region.entity';

@ObjectType()
@Entity({ name: 'mth_immunization_settings' })
export class ImmunizationSettings extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  region_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  title?: string;

  @Column()
  @Field(() => String, { nullable: true })
  min_grade_level?: string;

  @Column()
  @Field(() => String, { nullable: true })
  max_grade_level?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  min_school_year_required?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  max_school_year_required?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  immunity_allowed?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  exempt_update?: number;

  @Column()
  @Field(() => String, { nullable: true })
  level_exempt_update?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  consecutive_vaccine?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  min_spacing_interval?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  min_spacing_date?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  max_spacing_interval?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  max_spacing_date?: number;

  @Column()
  @Field(() => String, { nullable: true })
  email_update_template?: string;

  @Column()
  @Field(() => String, { nullable: true })
  date_created?: string;

  @Column()
  date_updated?: string;

  @Column()
  @Field(() => String, { nullable: true })
  tooltip?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  auto_populate_date_from?: number;

  @Column()
  @Field(() => Boolean)
  is_enabled?: boolean;

  @Column()
  @Field(() => Int)
  order?: number;

  @Field(() => [Int], { nullable: true })
  consecutives?: number[];

  @Column()
  @Field(() => Boolean)
  is_deleted?: boolean;

  @ManyToOne(() => Region, (region) => region.ImmunizationSettings)
  @JoinColumn([{ name: 'region_id', referencedColumnName: 'id' }])
  Region: Region;
}
