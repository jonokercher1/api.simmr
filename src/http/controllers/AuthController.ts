import { Get } from '../../core/utils/Router';

export default class AuthController {
  @Get('/test')
  async test(ctx: any): Promise<string> {
    console.log('🚀 ~ file: AuthController.ts ~ line 7 ~ AuthController ~ test ~ ctx', ctx);
    return 'test';
  }
}
