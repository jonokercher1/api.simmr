import faker from 'faker';
import { Knex } from 'knex';
import TestDatabaseConnector from '../mocks/database';
import { DatabaseConnection } from '../../src/infrastructure/types/DatabaseTypes';

export default class UserTestUtils {
  database: DatabaseConnection<Knex>;

  constructor() {
    this.database = new TestDatabaseConnector();
  }

  public async createUser(dataOverrides: any = {}): Promise<any> {
    return this.database.connection('user').insert({
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      ...dataOverrides,
    });
  }
}
