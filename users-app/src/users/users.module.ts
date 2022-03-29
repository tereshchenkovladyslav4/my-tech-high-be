import { UserAccessResolver } from './resolvers/access/user-access.resolver';
import { RegionResolver } from './resolvers/region/region-resolver';
import { UserRegionResolver } from './resolvers/region/user-region.resolver';
import { AccessResolver } from './resolvers/access/access-resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { UsersResolver } from './resolvers/users.resolver';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import RepoModule from './repo.module';
import { EmailTemplateResolver } from './resolvers/email-template/email-template.resolver';
const graphQLImports = [
  UsersResolver,
  AccessResolver,
  RegionResolver,
  UserRegionResolver,
  UserAccessResolver,
  EmailTemplateResolver,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLFederationModule.forRoot({
      plugins: [ApolloServerPluginInlineTraceDisabled()],
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
        orphanedTypes: [],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    RepoModule,
    ...graphQLImports,
  ],
})
export class UsersGraphqlModule {}
