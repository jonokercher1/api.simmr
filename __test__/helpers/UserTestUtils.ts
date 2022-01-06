import faker from 'faker';
import bcrypt from 'bcrypt';
import IDbUser from '../../src/infrastructure/database/types/IDbUser';
import MockUserRepository from '../mocks/repository/MockUserRepository';

export default class UserTestUtils {
  constructor(private readonly userRepository: MockUserRepository) {}

  public async createUser(dataOverrides: Partial<IDbUser> = {}): Promise<IDbUser> {
    const rawPassword = dataOverrides?.password ?? faker.internet.password();
    const userData: Partial<IDbUser> = {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      ...dataOverrides,
      password: await bcrypt.hash(rawPassword, 10),
    };

    const insertResult = this.userRepository.addToDataset<IDbUser>(userData);

    return insertResult[0];
  }

  public clearUsers(): void {
    this.userRepository.clearDataset();
  }
}
