import { Directive, Field, ObjectType } from '@nestjs/graphql'
import { User } from './user.entity'

@ObjectType()
export class ForgotPasswordResponse {
  @Field((type) => Boolean)
  status?: boolean

  @Field((type) => Boolean)
  unverified?: boolean
}
