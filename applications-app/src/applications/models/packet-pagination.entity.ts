import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Packet } from './packet.entity';

@ObjectType()
export class PacketPagination {
  @Field(() => [Packet])
  results?: Packet[];

  @Field(() => Int)
  page_total?: number;

  @Field(() => Int)
  total?: number;
}
