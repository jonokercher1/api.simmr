import MockRepository from './MockRepository';
import IUserRepository from '../../../src/core/contracts/infrastructure/database/IUserRepository';
import IDbUser from '../../../src/infrastructure/database/types/IDbUser';

export default class MockUserRepository extends MockRepository implements IUserRepository {
  public async findByEmailExcludingIds(email: string, ids: number[]): Promise<IDbUser> {
    return this.dataset.find((i) => i.email === email && !ids.includes(i.id));
  }
}
