import 'reflect-metadata';
import Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import { container } from 'tsyringe';
import router from '../http/routes';
import AuthController from '../http/controllers/AuthController';
import KnexConnector from '../infrastructure/database/connections/KnexConnector';

setupEnv();

container
  .register('Database', { useClass: KnexConnector })
  .registerSingleton(AuthController);

const server = new Koa();

server.use(router.routes());

export default server;
