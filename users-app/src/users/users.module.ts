import { UserAccessResolver } from './resolvers/access/user-access.resolver';
import { RegionResolver } from './resolvers/region/region-resolver';
import { UserRegionResolver } from './resolvers/region/user-region.resolver';
import { AccessResolver } from './resolvers/access/access-resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { UsersResolver } from './resolvers/users.resolver';
import { SchoolYearResolver } from './resolvers/schoolyear.resolver';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import RepoModule from './repo.module';
import { EmailTemplateResolver } from './resolvers/email-template/email-template.resolver';
import { EmailReminderResolver } from './resolvers/email-template/email-reminder.resolver';
import { SchoolDistrictsResolver } from './resolvers/region/schoolDistricts.resolver';

const graphQLImports = [
  UsersResolver,
  AccessResolver,
  RegionResolver,
  UserRegionResolver,
  UserAccessResolver,
  EmailTemplateResolver,
  SchoolYearResolver,
  EmailReminderResolver,
  SchoolDistrictsResolver,
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
