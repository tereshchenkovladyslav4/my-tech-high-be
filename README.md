# Infocenter V2

## Description

Microservices (or microservices architecture) are a cloud native architectural approach in which a single application is composed of many loosely coupled and independently deployable smaller components, or services.

## Built With

1. NestJs (https://github.com/nestjs/nest)
2. Kubernetes
3. TypeORM
4. GraphQL
5. Apollo Federation
6. MySQL

## Setting Up local env

1. Make sure you have mysql set up. I recommend using [MySQL Workbench](https://www.mysql.com/products/workbench/)
2. Create A new connection with the following:
   <br/>host: 127.0.0.1
   <br/>username: root
   <br/>password:
   <br/>port: 3306

3. Get a dump of the staging database and add it to the new connection you created.

## Prerequisites

1. Node v12.22.6(Node v16 LTS for windows to make sure TZ=UTC working)
   You can use [nvm](https://github.com/nvm-sh/nvm) (node version manager to download and toggle between versions)
   <br/> i. To download version ^12.22.6 run `nvm install 12.22.6`
   <br/> ii. To use version 12.22.6 run `nvm use 12.22.6`

2. [NPM Package manager](https://docs.npmjs.com/cli/v6)

### Installation

```bash
$ npm install
```

### Database setup

- using TypeORM CLI. Reffer to [migration documentation](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations) for intructions.

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Future Goals

Add tests;

## Development Process

1. Create a branch from master. The naming convention should be either:
   <br/>`feature/<ticket name>` or `feature/<description if no ticket>`
   <br/>`hotfix/<ticket name>` or `hotfix/<description if no ticket>`

2. Follow TDD Practices as best as possible.
   <br/> Write Unit test to test basic functions
   <br/> Write System tests to test resolvers

3. Push Code through pipeline and Create a P.R for it.

4. If your code passes Pipeline, get someone to review your code.

5. If it passes, push to staging for QA

6. If QA passes push to Prod.
