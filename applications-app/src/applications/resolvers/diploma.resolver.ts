import { Args, Query, Resolver, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationEvent } from '../models/event.entity';
import { DiplomaQuestion } from '../models/diploma-question.entity';
import { DiplomaQuestionInput } from '../dto/diploma-question.inputs';
import { DiplomaService } from '../services/diploma.service';
@Resolver((of) => ApplicationEvent)
export class DiplomaResolver {
    constructor(private diplomaService: DiplomaService) { }

    @Query((returns) => DiplomaQuestion, { name: 'getDiplomaQuestion', nullable: true })
    @UseGuards(new AuthGuard())
    async getDiplomaQuestion(
        @Args('diplomaQuestionInput')
        diplomaQuestionInput: DiplomaQuestionInput,
    ): Promise<DiplomaQuestion> {
        return this.diplomaService.getDiplomaQuestion(diplomaQuestionInput);
    }

    @Mutation((returns) => DiplomaQuestion, { name: 'saveDiplomaQuestion' })
    @UseGuards(new AuthGuard())
    async saveDiplomaQuestion(
        @Args('diplomaQuestionInput')
        diplomaQuestionInput: DiplomaQuestionInput,
    ): Promise<DiplomaQuestion> {
        return this.diplomaService.saveQuestion(diplomaQuestionInput);
    }

    @Mutation((returns) => Boolean, { name: 'saveDiplomaQuestionGrade' })
    @UseGuards(new AuthGuard())
    async saveDiplomaQuestionGrade(
        @Args('diplomaQuestionInput')
        diplomaQuestionInput: DiplomaQuestionInput,
    ): Promise<Boolean> {
        return this.diplomaService.saveQuestionGrades(diplomaQuestionInput);
    }
}
