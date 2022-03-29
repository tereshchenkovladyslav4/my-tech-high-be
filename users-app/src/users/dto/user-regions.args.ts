import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class UserRegionArgs {
    @Field(() => [Int])
    @IsNotEmpty()
    regions: [number];

}

