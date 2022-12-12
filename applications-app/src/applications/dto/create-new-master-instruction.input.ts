import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateOrUpdateInstructions {
    @Field(() => Int)
    @IsNotEmpty()
    master_id?: number;

    @Field(() => String, { nullable: true })
    instructions?: string;
}