import Router from 'koa-router';

const router = new Router({ prefix: '/item' });

router.get('/', (ctx) => {
  ctx.body = {
    message: 'hello world - item',
  };
});

export default router;
