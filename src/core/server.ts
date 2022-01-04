import 'reflect-metadata';
import Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import { container } from 'tsyringe';
import koabody from 'koa-body';
import router from '../http/routes';
import AuthController from '../http/controllers/AuthController/AuthController';
import KnexConnector from '../infrastructure/database/connections/KnexConnector';

setupEnv();

container
  .register('Database', { useClass: KnexConnector })
  .registerSingleton(AuthController);

const server = new Koa();

server.use(koabody());
server.use(router.routes());
server.use(router.allowedMethods());

export default server;
