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
@Entity({ name: 'county' })
export class County extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  county_name: string;

  @Column()
  @Field((type) => Int, { nullable: true })
  Region_id: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => Region, (region) => region.Counties, { onDelete: 'CASCADE' })
  @Field(() => Region, { nullable: true })
  @JoinColumn({ name: 'Region_id', referencedColumnName: 'id' })
  Region: Region;
}
