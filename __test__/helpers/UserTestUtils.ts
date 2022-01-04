import faker from 'faker';
import bcrypt from 'bcrypt';
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
    const rawPassword = dataOverrides?.password ?? faker.internet.password();

    const insertResult: any = await this.database.connection('users')
      .insert({
        email: faker.internet.email(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        ...dataOverrides,
        password: await bcrypt.hash(rawPassword, 10),
      })
      .returning('*');

    return insertResult[0];
  }

  public clearUsers(): Promise<void> {
    return this.database.connection('users').del();
  }
}
