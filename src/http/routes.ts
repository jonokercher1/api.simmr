import Router from 'koa-router';
import { container } from 'tsyringe';
import AuthController from './controllers/AuthController';

const router = new Router();

router.get('test', '/test', async (context) => {
  context.body = await container.resolve(AuthController).test(context);
});

export default router;
