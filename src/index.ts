import 'reflect-metadata';
import chalk from 'chalk';
import Koa from 'koa';
import koaBody from 'koa-body';
import { config as setupEnv } from 'dotenv';
import { container } from 'tsyringe';
import Logger from './infrastructure/logging/Logger';
import KnexConnector from './infrastructure/database/connections/KnexConnector';
import UserRepository from './infrastructure/database/repositories/UserRepository';
import AuthController from './http/controllers/AuthController/AuthController';
import router from './http/routes';
import UserService from './core/services/UserService/UserService';
import UserController from './http/controllers/UserController/UserController';
import AuthenticationService from './core/services/AuthenticationService/AuthenticationService';
import CollaboratorController from './http/controllers/CollaboratorController/CollaboratorController';

setupEnv();

container
  .register('AuthenticationService', { useClass: AuthenticationService })
  .register('Database', { useClass: KnexConnector })
  .register('Logger', { useClass: Logger })
  .register('UserRepository', { useClass: UserRepository })
  .register('UserService', { useClass: UserService })
  .registerSingleton(AuthController)
  .registerSingleton(CollaboratorController)
  .registerSingleton(UserController);

const server = new Koa();

server.use(koaBody());
server.use(router.routes());
server.use(router.allowedMethods());

const logger = container.resolve(Logger);

server.listen(process.env.API_PORT, () => {
  logger.info(chalk.green(`Server is listening on port ${process.env.API_PORT}`));
});
