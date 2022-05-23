import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Question } from 'src/models/question.entity';
import { QuestionInput } from 'src/users/dto/question.input';
import { QuestionService } from 'src/users/services/question.service';

@Resolver((of) => Question)
export class QuestionResolver {
	constructor(private service: QuestionService) {}

	@Query(() => [Question], { name: 'questionsByRegion' })
	questionsByRegion(
		@Args({ name: 'regionId', type: () => ID }) regionId: number,
		@Args({ name: 'section', type: () => String }) section: string,
	): Promise<Question[]> {
		return this.service.findByRegion(regionId, section);
	}

	@Mutation((returns) => Boolean, { name: 'saveQuestions' })
	async saveQuestions(
		@Args('questionsInput', { type: () => [QuestionInput] })
		questions: QuestionInput[],
	): Promise<boolean> {
		try {
			await Promise.all(questions.map((el) => this.service.save(el.question)));
			return true;
		} catch (e) {
			console.error('saveQuestions', e);
			return false;
		}
	}

	@Mutation(() => Int, { name: 'deleteQuestion' })
	async deleteQuestion(
		@Args('id', { type: () => Int }) id: number,
	): Promise<number> {
		return await this.service.delete(id);
	}
}
