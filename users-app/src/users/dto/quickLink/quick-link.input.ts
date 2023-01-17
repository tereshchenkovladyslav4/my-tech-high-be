import { Field, InputType } from '@nestjs/graphql';
import { QuickLink } from 'src/models/quick-link.entity';

@InputType()
export class QuickLinkInput {
  @Field(() => QuickLink)
  quickLink = null;
}
