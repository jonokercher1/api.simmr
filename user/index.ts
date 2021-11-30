import Koa from 'koa';
import router from './routes';

const app = new Koa();

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(4001, () => {
  console.log('Server is running on port 4001');
});
