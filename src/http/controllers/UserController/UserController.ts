import { inject, injectable } from 'tsyringe';
import { Context } from 'koa';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';
import IUserService from '../../../core/contracts/IUserService';

@injectable()
export default class UserController {
  constructor(@inject('UserService') private userService: IUserService, @inject('UserRepository') private authenticationService: IAuthenticationService) {}

  public async updateProfile(ctx: Context): Promise<any> {
    try {
      const token = ctx?.headers?.authorization?.replace('Bearer ', '') ?? '';

      const user = await this.authenticationService.getUserFromToken(token);

      return await this.userService.updateUser(user, ctx.request.body);
    } catch (e) {
      ctx.status = 400;

      return {
        message: (e as any)?.message ?? 'Umable to update profile',
      };
    }
  }
}
