import { Context, Next } from 'koa';
import IRequest from '../types/IRequest';

export default class RequestValidationMiddleware {
  public static validate = (validator: IRequest) => async (ctx: Context, next: Next) => {
    const { error } = validator.validate(ctx.request.body);

    if (error) {
      ctx.status = 422;
      ctx.body = {
        message: 'Invalid input',
        errors: error.details.map(({ message }) => message),
      };
    } else {
      await next();
    }
  };
}
