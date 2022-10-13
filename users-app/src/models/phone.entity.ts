import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

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
  name?: string;

  @Column()
  number?: string;

  @Column()
  ext?: string;

  @Column()
  recieve_text?: number;
}
