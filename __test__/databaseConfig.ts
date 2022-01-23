import { config as setupEnv } from 'dotenv';
import { Knex } from 'knex';

setupEnv({
  path: `${__dirname}/../.env.test`,
});

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    database: process.env.DATABASE_NAME ?? 'test.api.simmr',
    user: process.env.DATABASE_USER ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'postgres',
    port: Number(process.env.DATABASE_PORT ?? '5432'),
  },
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN_SIZE ?? '1'),
    max: Number(process.env.DATABASE_POOL_MAX_SIZE ?? '1'),
  },
  migrations: {
    tableName: 'migrations',
    directory: `${__dirname}/../src/infrastructure/database/migrations`,
  },
};

export default config;
