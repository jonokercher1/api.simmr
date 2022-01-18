import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import IUserService from '../../../core/contracts/IUserService';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';

@singleton()
export default class AuthController {
  constructor(@inject('IAuthenticationService') private authenticationService: IAuthenticationService, @inject('IUserService') private userService: IUserService) {}

  public async me(ctx: Context): Promise<any> {
    try {
      const token = ctx?.headers?.authorization?.replace('Bearer ', '') ?? '';

      const user = await this.authenticationService.getUserFromToken(token);

      return user;
    } catch (e) {
      ctx.status = 401;

      return { message: 'Unauthorised' };
    }
  }

  public async login(ctx: Context): Promise<any> {
    try {
      const { email, password } = ctx.request.body;

      const user = await this.authenticationService.verifyCredentials(email, password);

      const token = await this.authenticationService.generateToken(user.id);

      return { token, user };
    } catch (e: any) {
      ctx.status = 400;

      return {
        message: e?.message ?? 'Unable to login',
      };
    }
  }

  public async register(ctx: Context): Promise<any> {
    try {
      const user = await this.userService.createUser(ctx.request.body);

      const token = await this.authenticationService.generateToken(user.id);

      return { token, user };
    } catch (e: any) {
      ctx.status = 400;

      return {
        message: e?.message ?? 'Unable to register',
      };
    }
  }
}
