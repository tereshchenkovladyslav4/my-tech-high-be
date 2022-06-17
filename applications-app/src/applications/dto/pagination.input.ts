import { Field, ArgsType, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class PaginationInput {
	@Field((type) => Int)
	@Min(0)
	skip = 0;

	@Field((type) => Int)
	@Min(1)
	take = 25;

	@Field((type) => String)
	sort = '';
}
