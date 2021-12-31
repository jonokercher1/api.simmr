import { inject, singleton } from 'tsyringe';
import { DefaultContext } from 'koa';
import Controller from '../Controller';
import AuthenticationService from '../../../core/services/AuthenticationService/AuthenticationService';
import Logger from '../../../infrastructure/logging/Logger';

@singleton()
export default class AuthController extends Controller {
  constructor(@inject(Logger) logger: Logger, @inject(AuthenticationService) private readonly authenticationService: AuthenticationService) {
    super(logger);
  }

  async me(ctx: DefaultContext): Promise<any> {
    try {
      const token = ctx.headers.authorization.replace('Bearer ', '');
      return await this.authenticationService.getUserFromToken(token);
    } catch (error) {
      ctx.status = 401;
      return { message: 'Unauthorised' };
    }
  }
}
