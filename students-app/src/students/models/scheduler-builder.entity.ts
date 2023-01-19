import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive(
  '@key(fields: "id, max_num_periods, custom_built, split_enrollment, split_enrollment_grades, always_unlock, school_year_id, parent_tooltip, schoolYear, third_party_provider")',
)
@Directive('@extends')
@Entity({ name: 'mth_schedule_builder' })
export class ScheduleBuilder extends BaseEntity {
  @Column()
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id: number;

  @Column()
  @Field()
  @Directive('@external')
  max_num_periods: number;

  @Column()
  @Field()
  @Directive('@external')
  third_party_provider: number;

  @Column()
  @Field()
  @Directive('@external')
  custom_built: number;

  @Column()
  @Field()
  @Directive('@external')
  split_enrollment: number;

  @Column()
  @Field({ nullable: true })
  @Directive('@external')
  split_enrollment_grades?: string;

  @Column()
  @Field()
  @Directive('@external')
  always_unlock: number;

  @Column()
  @Field(() => ID)
  @Directive('@external')
  school_year_id: number;

  @Column()
  @Field()
  @Directive('@external')
  parent_tooltip: string;

  @OneToOne(() => SchoolYear, (schoolYear) => schoolYear.school_year_id, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'school_year_id', referencedColumnName: 'school_year_id' })
  @Field(() => SchoolYear, { nullable: true })
  @Directive('@external')
  schoolYear: SchoolYear;
}
