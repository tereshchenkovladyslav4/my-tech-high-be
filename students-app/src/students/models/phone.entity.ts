import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Person } from './person.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "phone_id, person_id")')
@Entity({ name: 'mth_phone' })
export class Phone extends BaseEntity {
  @Column()
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  @Directive('@external')
  phone_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  @Directive('@external')
  person_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  number?: string;

  @Column()
  @Field(() => String, { nullable: true })
  ext?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  recieve_text?: number;
}
