import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from './region.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity({ name: 'school_district' })
export class SchoolDistrict extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  @Field(() => String, { nullable: true })
  school_district_name: string;

  @Column()
  @Field(() => Int, { nullable: true })
  school_district_code: number;

  @Column()
  @Field(() => Int, { nullable: true })
  Region_id: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Region, (region) => region.SchoolDistricts, {
    onDelete: 'CASCADE',
  })
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'Region_id', referencedColumnName: 'id' })
  Region: Region;
}
