import 'reflect-metadata';
import Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import { container } from 'tsyringe';
import koabody from 'koa-body';
import router from '../http/routes';
import AuthController from '../http/controllers/AuthController/AuthController';
import KnexConnector from '../infrastructure/database/connections/KnexConnector';
import UserRepository from '../infrastructure/database/repositories/UserRepository';
import Logger from '../infrastructure/logging/Logger';

setupEnv();

container
  .register('Database', { useClass: KnexConnector })
  .register('Logger', { useClass: Logger })
  .register('UserRepository', { useClass: UserRepository })
  .registerSingleton(AuthController);

const server = new Koa();

server.use(koabody());
server.use(router.routes());
server.use(router.allowedMethods());

export default server;
