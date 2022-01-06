import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';
import IUserRepository from '../../../core/contracts/infrastructure/database/IUserRepository';

@singleton()
export default class UserRepository extends BaseRepository implements IUserRepository {
  public tableName = 'users';
}
