import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';
import IUserRepository from '../../../core/contracts/infrastructure/database/IUserRepository';
import IDbUser from '../types/IDbUser';

@singleton()
export default class UserRepository extends BaseRepository implements IUserRepository {
  public tableName = 'users';

  public async findByEmailExcludingIds(email: string, ids: number[]): Promise<IDbUser> {
    return this.connection(this.tableName)
      .where('email', email)
      .whereNotIn('id', ids)
      .first();
  }
}
