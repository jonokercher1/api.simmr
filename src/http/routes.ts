import Router from 'koa-router';
import { container } from 'tsyringe';
import AuthController from './controllers/AuthController/AuthController';
import UserController from './controllers/UserController/UserController';
import RequestValidationMiddleware from './middleware/RequestValidationMiddleware';
import LoginRequest from './requests/LoginRequest';
import RegisterRequest from './requests/RegisterRequest';
import UpdateProfileRequest from './requests/UpdateProfileRequest';

const router = new Router();

router.post('login', '/login', RequestValidationMiddleware.validate(new LoginRequest()), async (context) => {
  context.body = await container.resolve(AuthController).login(context);
});

router.post('register', '/register', RequestValidationMiddleware.validate(new RegisterRequest()), async (context) => {
  context.body = await container.resolve(AuthController).register(context);
});

router.get('me', '/me', async (context) => {
  context.body = await container.resolve(AuthController).me(context);
});

router.patch('update-profile', '/me', RequestValidationMiddleware.validate(new UpdateProfileRequest()), async (context) => {
  context.body = await container.resolve(UserController).updateProfile(context);
});

router.get('collaborators', '/collaborators', async (context) => {
  context.body = 'TODO: implement get collaborators';
});

router.patch('collaborators', '/collaborators', async (context) => {
  context.body = 'TODO: implement update collaborators';
});

router.get('items', '/items', async (context) => {
  context.body = 'TODO: implement get items';
});

router.post('items', '/items', async (context) => {
  context.body = 'TODO: implement create item';
});

router.patch('items', '/items', async (context) => {
  context.body = 'TODO: implement bulk update items';
});

router.post('items', '/items', async (context) => {
  context.body = 'TODO: implement create item';
});

router.patch('item', '/items/:itemId', async (context) => {
  context.body = 'TODO: implement update item';
});

router.delete('item', '/items/:itemId', async (context) => {
  context.body = 'TODO: implement delete item';
});

router.post('trip', '/shopping-trip', async (context) => {
  context.body = 'TODO: implement create shopping trip';
});

router.patch('trip', '/shopping-trip', async (context) => {
  context.body = 'TODO: implement update shopping trip';
});

export default router;
