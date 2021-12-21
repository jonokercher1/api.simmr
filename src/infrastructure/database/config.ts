import { config as setupEnv } from 'dotenv';

setupEnv();

const config = {
  test: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'migrations',
    },
  },

  development: {
    client: 'postgresql',
    connection: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'migrations',
    },
  },
};

export default config;
