import { Directive, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { ResourceRequest } from './resource-request.entity';

@InputType('resource_level')
@ObjectType()
@Directive('@key(fields: "resource_level_id, resource_id, name, limit, created_at, Resource")')
@Entity('mth_resource_level')
export class ResourceLevel {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  resource_level_id?: number;

  @Column('int')
  @Field(() => Int, { nullable: true })
  resource_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column('int', { name: 'limit', nullable: true })
  @Field(() => Int, { nullable: true })
  limit: number | null;

  @Column()
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @ManyToOne(() => Resource, (resource) => resource.ResourceLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Resource, { nullable: true })
  Resource: Resource;

  @OneToMany(() => ResourceRequest, (resourceRequest) => resourceRequest.ResourceLevel)
  // @Field(() => [ResourceRequest], { nullable: true })
  ResourceRequests: ResourceRequest[];
}
