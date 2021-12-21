import { config as setupEnv } from 'dotenv';

setupEnv();

const config = {
  client: 'postgresql',
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  },
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN_SIZE ?? '1', 10),
    max: parseInt(process.env.DATABASE_POOL_MAX_SIZE ?? '1', 10),
  },
  migrations: {
    tableName: 'migrations',
  },
};

export default config;
