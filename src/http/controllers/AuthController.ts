import { singleton } from 'tsyringe';
import { DefaultContext } from 'koa';
import Controller from './Controller';

@singleton()
export default class AuthController extends Controller {
  async test(ctx: DefaultContext): Promise<string> {
    this.logger.info('hello world', ctx);
    return 'test';
  }
}
