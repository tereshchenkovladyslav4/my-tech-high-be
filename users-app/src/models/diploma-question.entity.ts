import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity('mth_diploma_question')
export class DiplomaQuestion extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  @Field(() => Int)
  school_year_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  title?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  grades?: string;
}
