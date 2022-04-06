import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRegion } from './user-region.entity';
import { RegionProgram } from './region-program.enum';

@ObjectType()
@Directive('@key(fields: "id,name, program")')
@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field((type) => String, { nullable: true })
  name: string;

  @Column()
  @Field((type) => String, { nullable: true })
  program: String;

  @Column()
  @Field((type) => String, { nullable: true })
  state_logo: String;

  @ManyToOne(() => UserRegion, (userRegion) => userRegion.regionDetail)
  @Field(() => UserRegion, { nullable: true })
  region: UserRegion;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
