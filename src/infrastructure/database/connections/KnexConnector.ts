import knex, { Knex } from 'knex';
import config from '../config';
import IDatabaseConnection from '../../../core/contracts/infrastructure/database/IDatabaseConnection';

export default class KnexConnector implements IDatabaseConnection<Knex> {
  public connection: Knex;

  constructor() {
    this.connection = this.connect();
  }

  public connect() {
    return knex(config);
  }

  public async disconnect(): Promise<void> {
    return this.connection.destroy();
  }
}
