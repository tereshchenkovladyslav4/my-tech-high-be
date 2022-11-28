import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateNewClassInput {
    @Field(() => Int)
    @IsNotEmpty()
    master_id?: number;

    @Field(() => String)
    @IsNotEmpty()
    class_name: string;

    @Field(() => Int, { nullable: true })
    primary_id?: number;

    @Field(() => String, { nullable: true })
    addition_id: string;
}