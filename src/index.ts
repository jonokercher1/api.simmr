import 'reflect-metadata';
import chalk from 'chalk';
import Koa from 'koa';
import koaBody from 'koa-body';
import { config as setupEnv } from 'dotenv';
import { container } from 'tsyringe';
import Logger from './infrastructure/logging/Logger';
import KnexConnector from './infrastructure/database/connections/KnexConnector';
import UserRepository from './infrastructure/database/repositories/UserRepository';
import router from './http/routes';
import UserService from './core/services/UserService/UserService';
import AuthenticationService from './core/services/AuthenticationService/AuthenticationService';
import CollaboratorRepository from './infrastructure/database/repositories/CollaboratorRepository';

setupEnv();

container
  .register('IAuthenticationService', { useClass: AuthenticationService })
  .register('ICollaboratorRepository', { useClass: CollaboratorRepository })
  .register('IDatabase', { useClass: KnexConnector })
  .register('ILogger', { useClass: Logger })
  .register('IUserRepository', { useClass: UserRepository })
  .register('IUserService', { useClass: UserService });

const server = new Koa();

server.use(koaBody());
server.use(router.routes());
server.use(router.allowedMethods());

const logger = container.resolve(Logger);

server.listen(process.env.API_PORT, () => {
  logger.info(chalk.green(`Server is listening on port ${process.env.API_PORT}`));
});
