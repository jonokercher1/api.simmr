import knex, { Knex } from 'knex';
import { ConnectionConfigType, DatabaseConnection } from '../../types/DatabaseTypes';
import config from '../config';

export default class KnexConnector implements DatabaseConnection<Knex> {
  public connection: Knex;

  constructor() {
    this.connection = this.connect();
  }

  public connect() {
    const env = (process.env.NODE_ENV ?? 'development') as ConnectionConfigType;
    const options = config[env] as Knex.Config;

    return knex(options);
  }
}
