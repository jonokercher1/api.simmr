import { singleton } from 'tsyringe';
import ICollaboratorRepository from '../../../core/contracts/infrastructure/database/ICollaboratorRepository';
import BaseRepository from './BaseRepository';
import IDbCollaborator from '../types/IDbCollaborator';

@singleton()
export default class CollaboratorRepository extends BaseRepository implements ICollaboratorRepository {
  public tableName = 'collaborators';

  private readonly collaboratorFields = [
    'spaceId',
    'collaborators.createdAt',
    'collaborators.updatedAt',
    'collaborators.deletedAt',
    'users.id',
    'users.email',
    'users.firstName',
    'users.lastName',
  ];

  public async getBySpaceId<T = IDbCollaborator>(spaceId: number, returns: string[] = this.collaboratorFields): Promise<T[]> {
    return this.connection(this.tableName)
      .join('users', 'users.id', 'collaborators.userId')
      .where({ spaceId })
      .select(returns) as any; // TOOD: fix the types of Knex here
  }

  addNewCollaboratorsToSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaborator[]> {
    return this.connection(this.tableName)
      .insert(collaboratorIds.map((id) => ({ spaceId, userId: id })))
      .returning(this.collaboratorFields);
  }

  removeCollaboratorsFromSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaborator[]> {
    return this.connection(this.tableName)
      .where({ spaceId })
      .whereIn('userId', collaboratorIds)
      .delete()
      .returning(this.collaboratorFields);
  }
}
