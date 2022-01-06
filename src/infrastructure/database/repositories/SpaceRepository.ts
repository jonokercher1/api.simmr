import { singleton } from 'tsyringe';
import BaseRepository from './BaseRepository';
import ISpaceRepository from '../../../core/contracts/infrastructure/database/ISpaceRepository';

@singleton()
export default class SpaceRepository extends BaseRepository implements ISpaceRepository {
  public tableName = 'items';
}
