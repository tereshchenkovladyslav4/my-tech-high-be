import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import RoleRepoModule from './repo.module';
import { RoleResolver } from './resolver/role.resolver';

const graphQLImports = [RoleResolver];

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
    RoleRepoModule,
    ...graphQLImports,
  ],
})
export class RoleGraphqlModule {}
