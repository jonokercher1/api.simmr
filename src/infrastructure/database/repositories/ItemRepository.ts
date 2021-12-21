import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';

@singleton()
export default class ItemRepository extends BaseRepository {
  public tableName = 'items';
}
