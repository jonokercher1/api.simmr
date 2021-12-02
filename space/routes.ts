import Router from 'koa-router';

const router = new Router({ prefix: '/space' });

router.get('/', (ctx) => {
  ctx.body = {
    message: 'hello world - space',
  };
});

export default router;
