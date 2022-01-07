import { inject, injectable } from 'tsyringe';
import { Context } from 'koa';
// import Controller from '../Controller';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import Logger from '../../../infrastructure/logging/Logger';

@injectable()
export default class AuthController {
  constructor(@inject('Logger') private logger: Logger, private authenticationService: AuthenticationService) {}

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
      const error: any = e;

      ctx.status = 400;

      return {
        message: error?.message ?? 'Unable to login',
      };
    }
  }
}
