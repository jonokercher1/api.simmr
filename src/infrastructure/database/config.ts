import { config as setupEnv } from 'dotenv';
import { Knex } from 'knex';

setupEnv();

const config: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT ?? '5432'),
  },
  pool: {
    min: Number(process.env.DATABASE_POOL_MIN_SIZE ?? '1'),
    max: Number(process.env.DATABASE_POOL_MAX_SIZE ?? '1'),
  },
  migrations: {
    tableName: 'migrations',
  },
};

export default config;
