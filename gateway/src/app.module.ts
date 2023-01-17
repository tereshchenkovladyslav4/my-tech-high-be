import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    // lets pass authorization token
    request.http.headers.set('authorization', context.jwt);
  }
}
@Module({
  providers: [
    AppService,
    {
      provide: AuthenticatedDataSource,
      useValue: AuthenticatedDataSource,
    },
    {
      provide: GATEWAY_BUILD_SERVICE,
      useFactory: (AuthenticatedDataSource) => {
        return ({ url }) => new AuthenticatedDataSource({ url });
      },
      inject: [AuthenticatedDataSource],
    },
  ],
  exports: [GATEWAY_BUILD_SERVICE],
  controllers: [AppController],
})
class BuildServiceModule {}
@Module({
  imports: [
    GraphQLGatewayModule.forRootAsync({
      useFactory: async () => ({
        gateway: {
          serviceList: [
            {
              name: 'auth',
              url: `https://${process.env.AUTH_HOST || 'localhost'}/graphql`,
            },
            {
              name: 'users',
              url: `https://${process.env.USERS_HOST || 'localhost'}/graphql`,
            },
            {
              name: 'students',
              url: `https://${process.env.STUDENTS_HOST || 'localhost'}/graphql`,
            },
            {
              name: 'applications',
              url: `https://${process.env.APPLICATIONS_HOST || 'localhost'}/graphql`,
            },
          ],
        },
        server: {
          context: ({ req }) => ({
            jwt: req.headers.authorization,
          }),
          cors: true,
        },
      }),
      imports: [BuildServiceModule],
      inject: [GATEWAY_BUILD_SERVICE],
    }),
  ],
})
export class AppModule {}
