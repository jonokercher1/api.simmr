import faker from 'faker';
import bcrypt from 'bcrypt';
import IDbUser from '../../src/infrastructure/database/types/IDbUser';
import MockUserRepository from '../mocks/repository/MockUserRepository';
import IUserRepository from '../../src/core/contracts/infrastructure/database/IUserRepository';

export default class UserTestUtils {
  constructor(private userRepository: IUserRepository) {}

  public async createUser(dataOverrides: Partial<IDbUser> = {}): Promise<IDbUser> {
    const rawPassword = dataOverrides?.password ?? faker.internet.password();
    const userData: Partial<IDbUser> = {
      id: faker.datatype.number(),
      email: faker.internet.email(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      ...dataOverrides,
      password: await bcrypt.hash(rawPassword, 10),
    };

    const insertResult = await this.userRepository.insert<Partial<IDbUser>, IDbUser>(userData);

    return insertResult[0];
  }

  public clearUsers(): void {
    this.userRepository.deleteAll();
  }
}
