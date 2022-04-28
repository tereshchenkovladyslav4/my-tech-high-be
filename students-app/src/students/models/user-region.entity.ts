import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
@Entity({ name: 'user_region' })
export class UserRegion extends BaseEntity {
  @Column()
  @Field((type) => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  id: number;

  @Column()
  region_id: number;

  @Column()
  user_id: number;
}
