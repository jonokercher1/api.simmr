import { singleton } from 'tsyringe';
import IItemRepository from '../../../core/contracts/infrastructure/database/IItemRepository';
import BaseRepository from './BaseRepository';

@singleton()
export default class ItemRepository extends BaseRepository implements IItemRepository {
  public tableName = 'items';
}
