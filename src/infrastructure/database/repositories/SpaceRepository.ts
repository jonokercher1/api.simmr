import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';

@singleton()
export default class SpaceRepository extends BaseRepository {
  public tableName = 'items';
}
