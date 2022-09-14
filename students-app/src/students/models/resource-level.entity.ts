import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { Student } from './student.entity';
import { ResourceRequest } from './resource-request.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "resource_level_id, resource_id, name, limit, created_at, Resource")')
@Entity('mth_resource_level')
export class ResourceLevel {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  resource_level_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
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

  @Field(() => Int, { nullable: true })
  TotalRequests: number;

  @ManyToOne(() => Resource, (resource) => resource.ResourceLevels, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resource_id', referencedColumnName: 'resource_id' }])
  @Field(() => Student, { nullable: true })
  @Directive('@external')
  Resource: Resource;

  @OneToMany(() => ResourceRequest, (resourceRequest) => resourceRequest.ResourceLevel)
  @Field(() => [ResourceRequest], { nullable: true })
  ResourceRequests: ResourceRequest[];
}
