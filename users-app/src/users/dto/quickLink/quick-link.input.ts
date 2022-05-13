import { Field, InputType, Int } from '@nestjs/graphql';
import { QuickLink } from 'src/models/quick-link.entity';

@InputType()
export class QuickLinkInput {
  @Field((type) => QuickLink)
  quickLink = null;
}
