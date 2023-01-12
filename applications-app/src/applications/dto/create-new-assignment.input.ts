import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateNewAssignmentInput {
    @Field(() => Int, { nullable: true })
    assignment_id?: number;

    @Field(() => Int)
    master_id?: number;

    @Field(() => String)
    title?: string;

    @Field(() => Date)
    dueDateTime?: Date;

    @Field(() => Date)
    reminderDateTime?: Date;

    @Field(() => Date)
    autoGradeDateTime?: Date;

    @Field(() => Date)
    teacher_deadline?: Date;

    @Field(() => Boolean)
    autoGradeEmail?: boolean;

    @Field(() => Int, { defaultValue: 1 })
    page_count?: number;
}
