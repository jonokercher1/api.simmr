import Koa from 'koa';
import Router from 'koa-router';
import UserAuthenticator from './middleware/UserAuthenticator';
import { KoaContext } from './types/Koa';

const router = new Router<Koa.DefaultState, KoaContext>({ prefix: '/user' });

router.get('/current', UserAuthenticator.validateUser, (ctx) => {
  console.log('🚀 ~ file: routes.ts ~ line 7 ~ router.get ~ ctx', ctx.user);
  ctx.body = {
    message: 'hello world',
  };
});

export default router;
