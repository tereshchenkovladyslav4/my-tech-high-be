import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { UsersResolver } from './users/resolvers/users.resolver';
import { MePermission } from './users/models/me-permission.entity';
import { LocalStrategy } from './users/strategies/local.strategy';
import { MeConfirmation } from './users/models/me-confirmation.entity';

const graphQLImports = [UsersResolver];
@Module({
  imports: [
    AuthModule,
    UsersModule,
    GraphQLFederationModule.forRoot({
      plugins: [ApolloServerPluginInlineTraceDisabled()],
      autoSchemaFile: true,
      playground: true,
      introspection: true,
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
        orphanedTypes: [MePermission, MeConfirmation],
      },
      context: ({ req }) => ({ headers: req.headers }),
    }),
    ...graphQLImports,
  ],
  controllers: [AppController],
  providers: [AppService, LocalStrategy],
})
export class AppModule {}
