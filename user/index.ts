import Koa from 'koa';
import { config as setupEnv } from 'dotenv';
import router from './routes';
import { KoaContext } from './types/Koa';

setupEnv();

const app = new Koa<Koa.DefaultState, KoaContext>();

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.API_PORT, () => {
  console.log(`Server is running on port ${process.env.API_PORT}`);
});
