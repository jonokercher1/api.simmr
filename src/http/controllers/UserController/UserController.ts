import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';
import IUserService from '../../../core/contracts/IUserService';

@singleton()
export default class UserController {
  constructor(@inject('IUserService') private userService: IUserService, @inject('IAuthenticationService') private authenticationService: IAuthenticationService) {}

  public async updateProfile(ctx: Context): Promise<any> {
    try {
      const token = ctx?.headers?.authorization?.replace('Bearer ', '') ?? '';

      const user = await this.authenticationService.getUserFromToken(token);

      return await this.userService.updateUser(user, ctx.request.body);
    } catch (e: any) {
      ctx.status = 400;

      return {
        message: e?.message ?? 'Umable to update profile',
      };
    }
  }
}
