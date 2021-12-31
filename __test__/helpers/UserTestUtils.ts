import faker from 'faker';
import { Knex } from 'knex';
import TestDatabaseConnector from '../mocks/database';
import { DatabaseConnection } from '../../src/infrastructure/types/DatabaseTypes';

export default class UserTestUtils {
  public database: DatabaseConnection<Knex>;

  constructor() {
    this.database = new TestDatabaseConnector();
    // TODO: Need to kill this connection when the class is destroyed???
  }

  public async createUser(dataOverrides: any = {}): Promise<any> {
    const insertResult: any = await this.database.connection('users')
      .insert({
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        ...dataOverrides,
      })
      .returning('*');

    return insertResult[0];
  }
}
