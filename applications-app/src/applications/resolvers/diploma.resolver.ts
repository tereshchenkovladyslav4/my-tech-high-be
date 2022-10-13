import { Args, Query, Resolver, Mutation, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApplicationEvent } from '../models/event.entity';
import { DiplomaQuestion } from '../models/diploma-question.entity';
import { DiplomaQuestionInput } from '../dto/diploma-question.inputs';
import { DiplomaService } from '../services/diploma.service';
import { DiplomaAnswer } from '../models/diploma-answer.entity';
import { DiplomaAnswerInput } from '../dto/diploma-answer.inputs';
import { DiplomaAnswerService } from '../services/diploma-answer.service';
@Resolver((of) => ApplicationEvent)
export class DiplomaResolver {
  constructor(private diplomaService: DiplomaService, private diplomaAnswerService: DiplomaAnswerService) {}

  @Query((returns) => DiplomaQuestion, { name: 'getDiplomaQuestion', nullable: true })
  @UseGuards(new AuthGuard())
  async getDiplomaQuestion(
    @Args('diplomaQuestionInput')
    diplomaQuestionInput: DiplomaQuestionInput,
  ): Promise<DiplomaQuestion> {
    return this.diplomaService.getDiplomaQuestion(diplomaQuestionInput);
  }

  @Query((returns) => DiplomaQuestion, { name: 'getDiplomaQuestionForStudent', nullable: true })
  @UseGuards(new AuthGuard())
  async getDiplomaQuestionForStudent(
    @Args('diplomaQuestionInput')
    diplomaQuestionInput: DiplomaQuestionInput,
  ): Promise<DiplomaQuestion> {
    return this.diplomaService.getDiplomaQuestionForStudent(diplomaQuestionInput);
  }

  @Query((returns) => DiplomaAnswer, { name: 'getDiplomaAnswer', nullable: true })
  @UseGuards(new AuthGuard())
  async getDiplomaAnswer(
    @Args('diplomaAnswerInput')
    diplomaAnswerInput: DiplomaAnswerInput,
  ): Promise<DiplomaAnswer> {
    return this.diplomaAnswerService.getDiplomaAnswer(diplomaAnswerInput);
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
  ): Promise<boolean> {
    return this.diplomaService.saveQuestionGrades(diplomaQuestionInput);
  }

  @Mutation((returns) => DiplomaAnswer, { name: 'saveDiplomaAnswer' })
  @UseGuards(new AuthGuard())
  async saveDiplomaAnswer(
    @Args('saveDiplomaAnswerInput')
    diplomaAnswerInput: DiplomaAnswerInput,
  ): Promise<DiplomaAnswer> {
    return this.diplomaAnswerService.saveDiplomaAnswer(diplomaAnswerInput);
  }
}
