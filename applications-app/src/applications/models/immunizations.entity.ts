import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
@Entity({ name: 'mth_immunizations'})
export class Immunizations extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id?: number

  @Column()
  title?: string

  @Column()
  min_grade_level?: string

  @Column()
  max_grade_level?: string

  @Column()
  min_school_year_required?: number

  @Column()
  max_school_year_required?: number
  
  @Column()
  immunity_allowed?: number

  @Column()
  exempt_update?: number

  @Column()
  requires_update?: number

  @Column()
  level_requires_update?: number

  @Column()
  level_exempt_update?: number

  @Column()
  consecutive_vaccine?: number

  @Column()
  min_spacing_interval?: number

  @Column()
  min_spacing_date?: string

  @Column()
  max_spacing_interval?: number

  @Column()
  max_spacing_date?: string

  @Column()
  email_update_template?: string
}
