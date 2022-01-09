import Router from 'koa-router';
import { container } from 'tsyringe';
import AuthController from './controllers/AuthController/AuthController';
import RequestValidationMiddleware from './middleware/RequestValidationMiddleware';
import LoginRequest from './requests/LoginRequest';
import RegisterRequest from './requests/RegisterRequest';

const router = new Router();

router.get('me', '/me', async (context) => {
  context.body = await container.resolve(AuthController).me(context);
});

router.post('login', '/login', RequestValidationMiddleware.validate(new LoginRequest()), async (context) => {
  context.body = await container.resolve(AuthController).login(context);
});

router.post('register', '/register', RequestValidationMiddleware.validate(new RegisterRequest()), async (context) => {
  context.body = await container.resolve(AuthController).register(context);
});

export default router;
