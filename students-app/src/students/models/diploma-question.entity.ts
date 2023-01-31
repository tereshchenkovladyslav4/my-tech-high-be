import { Field, ObjectType, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id, school_year_id, title, description, grades")')
@Entity('mth_diploma_question')
export class DiplomaQuestion extends BaseEntity {
  @Column()
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn('increment')
  @Directive('@external')
  id: number;

  @Column()
  @Field(() => Int)
  @Directive('@external')
  school_year_id: number;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  title?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  @Directive('@external')
  grades?: string;
}
