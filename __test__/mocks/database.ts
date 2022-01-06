import { config as setupEnv } from 'dotenv';
import knex, { Knex } from 'knex';
import IDatabaseConnection from '../../src/core/contracts/infrastructure/database/IDatabaseConnection';

const env = setupEnv({ path: './.env.test' });

const databaseName = env?.parsed?.DATABASE_NAME ?? '';
const databaseConfig: Knex.Config = {
  client: 'pg',
  connection: {
    database: databaseName,
    host: env?.parsed?.DATABASE_HOST,
    password: env?.parsed?.DATABASE_PASSWORD,
    port: Number(env?.parsed?.DATABASE_PORT),
    user: env?.parsed?.DATABASE_USER,
  },
};

// TODO: it would be beter to have a mock implementation here but I cannot be assed currently
export default class TestDatabaseConnector implements IDatabaseConnection<Knex> {
  public connection: Knex;

  constructor() {
    this.connection = this.connect();
  }

  public connect(): Knex {
    this.connection = knex(databaseConfig);
    return this.connection;
  }

  public async disconnect(): Promise<void> {
    return this.connection.destroy();
  }
}
