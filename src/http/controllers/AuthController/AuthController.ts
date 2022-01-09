import { inject, injectable } from 'tsyringe';
import { Context } from 'koa';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import Logger from '../../../infrastructure/logging/Logger';
import UserService from '../../../core/services/UserService/UserService';

@injectable()
export default class AuthController {
  constructor(@inject('Logger') private logger: Logger, private authenticationService: AuthenticationService, private userService: UserService) {}

  async me(ctx: Context): Promise<any> {
    try {
      const token = ctx?.headers?.authorization?.replace('Bearer ', '') ?? '';
      const user = await this.authenticationService.getUserFromToken(token);

      return user;
    } catch (error) {
      ctx.status = 401;

      return { message: 'Unauthorised' };
    }
  }

  async login(ctx: Context): Promise<any> {
    try {
      const { email, password } = ctx.request.body;

      const user = await this.authenticationService.verifyCredentials(email, password);

      const token = await this.authenticationService.generateToken(user.id);

      return { token, user };
    } catch (e) {
      ctx.status = 400;

      return {
        message: (e as any)?.message ?? 'Unable to login',
      };
    }
  }

  async register(ctx: Context): Promise<any> {
    try {
      const user = await this.userService.createUser(ctx.request.body);

      const token = await this.authenticationService.generateToken(user.id);

      return { token, user };
    } catch (e) {
      ctx.status = 400;

      return {
        message: (e as any)?.message ?? 'Unable to register',
      };
    }
  }
}
