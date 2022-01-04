import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import Controller from '../Controller';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import Logger from '../../../infrastructure/logging/Logger';

@singleton()
export default class AuthController extends Controller {
  constructor(@inject(Logger) logger: Logger, @inject(AuthenticationService) private readonly authenticationService: AuthenticationService) {
    super(logger);
  }

  async me(ctx: Context): Promise<any> {
    try {
      const token = ctx?.headers?.authorization?.replace('Bearer ', '') ?? '';
      const user = await this.authenticationService.getUserFromToken(token);

      return { user, token };
    } catch (error) {
      ctx.status = 401;
      return { message: 'Unauthorised' };
    }
  }

  async login(ctx: Context): Promise<any> {
    try {
      const { email, password } = ctx.request.body;

      const user = await this.authenticationService.verifyCredentials(email, password);
      const token = await this.authenticationService.generateToken(user.id.toString());

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
