import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { Student } from './student.entity';

@ObjectType()
@Directive('@key(fields: "resource_level_id, resource_id, name, limit, created_at, Resource")')
@Entity('mth_resource_level')
export class ResourceLevel {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  resource_level_id?: number;

  @Column()
  @Field(() => ID, { nullable: true })
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
  @Field(() => Student, { nullable: true })
  Resource: Resource;
}
