import { Directive, Field, ObjectType, Int, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity, Unique } from 'typeorm';

@InputType('packet_file')
@ObjectType()
@Directive('@key(fields: "file_id, packet_id, mth_file_id")')
@Entity('mth_packet_file')
@Unique('packet_file_id', ['packet_id', 'mth_file_id'])
export class PacketFile extends BaseEntity {
  @Column('int')
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  file_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  packet_id?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  mth_file_id?: number;

  @Column()
  @Field(() => String, { nullable: true })
  kind?: string;
}
