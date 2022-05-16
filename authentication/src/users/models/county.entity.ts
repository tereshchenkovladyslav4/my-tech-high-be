import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Region } from './region.entity'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
@Entity({ name: 'county' })
export class County extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number

  @Column()
  county_name: string

  @Column()
  Region_id: number

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @ManyToOne(() => Region, (region) => region.Counties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Region_id', referencedColumnName: 'id' })
  Region: Region
}
