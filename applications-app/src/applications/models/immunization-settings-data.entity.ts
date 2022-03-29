import { Field, ObjectType } from '@nestjs/graphql';
import { ImmunizationSettings } from './immunization-settings.entity';

@ObjectType()
export class ImmunizationSettingsData {

  @Field((type) => [ImmunizationSettings])
  results?: ImmunizationSettings[]
}
