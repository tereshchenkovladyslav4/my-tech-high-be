import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { UserRegion } from './user-region.entity'

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id,name,program")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  @Directive('@external')
  id: number

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  name: string

  @Column()
  @Field((type) => String, { nullable: true })
  @Directive('@external')
  program: string

  @OneToMany(() => UserRegion, (userRegion) => userRegion.regionDetail)
  region: UserRegion
}
