import knex, { Knex } from 'knex';
import { DatabaseConnection } from '../../types/DatabaseTypes';
import config from '../config';

export default class KnexConnector implements DatabaseConnection<Knex> {
  public connection: Knex;

  constructor() {
    this.connection = this.connect();
  }

  public connect() {
    return knex(config as Knex.Config);
  }
}
