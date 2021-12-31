import Router from 'koa-router';
import { container } from 'tsyringe';
import AuthController from './controllers/AuthController/AuthController';

const router = new Router();

router.get('me', '/me', async (context) => {
  context.body = await container.resolve(AuthController).me(context);
});

export default router;
