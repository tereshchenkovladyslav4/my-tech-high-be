import { Directive, Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Packet } from './packet.entity';

@ObjectType()
export class PacketPagination {
  @Field((type) => [Packet])
  results?: Packet[];

  @Field((type) => Int)
  page_total?: number;

  @Field((type) => Int)
  total?: number;
}
