import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SchoolYear } from './schoolyear.entity';

@ObjectType()
@Directive('@key(fields: "id, max_num_periods, custom_built, split_enrollment, always_unlock, school_year_id, parent_tooltip, schoolYear, third_party_provider")')
@Entity({ name: 'mth_schedule_builder' })
export class ScheduleBuilder extends BaseEntity {
    @Column()
		@Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
		@Field()
    max_num_periods: number;

    @Column()
		@Field()
    custom_built: number;

    @Column()
		@Field()
    third_party_provider: number;

    @Column()
		@Field()
    split_enrollment: number

    @Column()
		@Field()
    always_unlock: number;

    @Column()
		@Field(() => ID)
    school_year_id: number;

		@Column()
		@Field()
		parent_tooltip: string;

    @OneToOne(() => SchoolYear, (schoolYear) => schoolYear.school_year_id, {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'school_year_id', referencedColumnName: 'school_year_id' })
    @Field(() => SchoolYear, { nullable: true })
    schoolYear: SchoolYear;
}