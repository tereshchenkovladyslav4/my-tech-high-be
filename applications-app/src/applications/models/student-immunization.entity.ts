import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ImmunizationSettings } from './immunization-settings.entity';

@ObjectType()
@Entity({ name: 'mth_student_immunizations' })
export class StudentImmunization {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  student_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryColumn()
  immunization_id?: number;

  @Column()
  @Field({ nullable: true })
  value?: string;

  @Column()
  @Field(() => Int)
  updated_by?: number;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  date_created?: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  date_updated?: Date;

  @Field(() => ImmunizationSettings, { nullable: true })
  immunization?: ImmunizationSettings;
}
