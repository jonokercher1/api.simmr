import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';

@singleton()
export default class UserRepository extends BaseRepository {
  public tableName = 'users';
}
