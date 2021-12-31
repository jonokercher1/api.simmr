import KoaRouter from 'koa-router';

enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

const router = new KoaRouter();

export function Route(method: HttpMethod, path: string) {
  return function handler(target: any, key: string) {
    router[method](path, async (context) => {
      context.body = await target[key](context);
    });
  };
}

export const Get = (path: string) => Route(HttpMethod.GET, path);
export const Post = (path: string) => Route(HttpMethod.POST, path);
export const Put = (path: string) => Route(HttpMethod.PUT, path);
export const Patch = (path: string) => Route(HttpMethod.PATCH, path);
export const Delete = (path: string) => Route(HttpMethod.DELETE, path);

export default router;
