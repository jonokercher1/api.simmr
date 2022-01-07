import Koa from 'koa';
import koaBody from 'koa-body';
import router from '../../src/http/routes';

const server = new Koa();

server.use(koaBody());
server.use(router.routes());
server.use(router.allowedMethods());

export default server;
