import knex, { Knex } from 'knex';
import knexStringcase from 'knex-stringcase';
import IDatabaseConnection from '../../src/core/contracts/infrastructure/database/IDatabaseConnection';
import config from '../../src/infrastructure/database/config'; // TODO: replace with test config

export default class TestDatabaseConnection implements IDatabaseConnection<Knex> {
  connection: Knex<any, unknown[]>;

  constructor() {
    this.connection = this.connect();
  }

  public connect(): Knex<any, unknown[]> {
    return knex(this.getConfig());
  }

  public async disconnect(): Promise<void> {
    return this.connection.destroy();
  }

  private getConfig(): Knex.Config {
    return knexStringcase(config);
  }
}
