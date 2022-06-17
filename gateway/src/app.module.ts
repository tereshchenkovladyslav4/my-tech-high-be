import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { decode } from 'jsonwebtoken';
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
        return ({ name, url }) => new AuthenticatedDataSource({ url });
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
              url: `http://${
                process.env.AUTH_HOST || 'localhost'
              }:3003/graphql`,
            },
            {
              name: 'users',
              url: `http://${
                process.env.USERS_HOST || 'localhost'
              }:3000/graphql`,
            },
            {
              name: 'students',
              url: `http://${
                process.env.STUDENTS_HOST || 'localhost'
              }:3001/graphql`,
            },
            {
              name: 'applications',
              url: `http://${
                process.env.APPLICATIONS_HOST || 'localhost'
              }:3004/graphql`,
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
