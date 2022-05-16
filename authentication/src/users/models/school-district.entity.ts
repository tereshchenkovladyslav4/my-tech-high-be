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
@Directive('@extends')
@Directive('@key(fields: "id")')
@Entity({ name: 'school_district' })
export class SchoolDistrict extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number;

  @Column()
  school_district_name: string;

  @Column()
  school_district_code: number;

  @Column()
  Region_id: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Region, (region) => region.SchoolDistricts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Region_id', referencedColumnName: 'id' })
  Region: Region;
}
