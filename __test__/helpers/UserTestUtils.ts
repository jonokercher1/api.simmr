import faker from 'faker';
import bcrypt from 'bcrypt';
import IDbUser from '../../src/infrastructure/database/types/IDbUser';
import TestDatabaseConnection from './TestDatabaseConnection';

export default class UserTestUtils {
  constructor(private database: TestDatabaseConnection) {}

  public async createUser(dataOverrides: Partial<IDbUser> = {}): Promise<IDbUser> {
    const rawPassword = dataOverrides?.password ?? faker.internet.password();
    const userData = {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      ...dataOverrides,
      password: await bcrypt.hash(rawPassword, 10),
    };

    const insertResult = await this.database.connection<IDbUser>('users')
      .insert<IDbUser>(userData)
      .returning('*');

    return insertResult[0];
  }

  public clearUsers(): void {
    this.database.connection('users').whereNotNull('id').del();
  }
}
