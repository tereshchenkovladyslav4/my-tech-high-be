import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "resource_level_id, resource_id, name, limit, created_at, Resource")')
@Entity('mth_resource_level')
export class ResourceLevel {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  resource_level_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  resource_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  name: string;

  @Column('int', { name: 'limit', nullable: true })
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  limit: number | null;

  @Column()
  @Field(() => Date, { nullable: true })
  @Directive('@external')
  created_at?: Date;

  @ManyToOne(() => Resource, (resource) => resource.ResourceLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Resource, { nullable: true })
  @Directive('@external')
  Resource: Resource;
}
