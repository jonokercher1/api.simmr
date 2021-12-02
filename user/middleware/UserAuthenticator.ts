import { KoaContext, MiddlewareNextFunction } from '../types/Koa';

class UserAuthenticator {
  public static async validateUser(context: KoaContext, next: MiddlewareNextFunction) {
    context.user = {
      id: '123',
      email: 'email@email.com',
    };

    next();
  }
}

export default UserAuthenticator;
