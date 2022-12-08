import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateNewMasterInput {
    @Field(() => Int, { nullable: true })
    master_id?: number;

    @Field(() => Int)
    school_year_id?: number;

    @Field(() => String)
    master_name?: string;
}
