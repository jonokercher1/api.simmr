import { DefaultContext } from 'koa';
import { User } from './User';

export interface KoaContext extends DefaultContext {
  user?: User;
}

export type MiddlewareNextFunction = () => void | Promise<void>;
