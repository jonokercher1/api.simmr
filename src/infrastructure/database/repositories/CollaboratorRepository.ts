import { singleton } from 'tsyringe';
import ICollaboratorRepository from '../../../core/contracts/infrastructure/database/ICollaboratorRepository';
import BaseRepository from './BaseRepository';
import { IDbCollaboratorWithUser } from '../types/IDbCollaborator';

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

  public async getBySpaceId<T = IDbCollaboratorWithUser>(spaceId: number, returns: string[] = this.collaboratorFields): Promise<T[]> {
    return this.connection(this.tableName)
      .innerJoin('users', 'users.id', 'collaborators.userId')
      .where({ spaceId }) // TOOD: fix the types of Knex here
      .select(returns) as any;
  }

  public async isCollaboratorInSpace(userId: number, spaceId: number): Promise<boolean> {
    const query = await this.connection(this.tableName)
      .where({ spaceId, userId })
      .count();

    return !!query;
  }

  public getUsersCollaborators(userId: number): Promise<IDbCollaboratorWithUser[]> {
    const spaceIdQuery = this.connection(this.tableName).where('userId', userId).select('spaceId');

    return this.connection(this.tableName)
      .join('users', 'users.id', 'collaborators.userId')
      .where('spaceId', spaceIdQuery)
      .where('collaborators.userId', '!=', userId)
      .select(this.collaboratorFields);
  }

  public addNewCollaboratorsToSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaboratorWithUser[]> {
    return this.connection(this.tableName)
      .insert(collaboratorIds.map((id) => ({ spaceId, userId: id })))
      .returning(this.collaboratorFields);
  }

  public removeCollaboratorsFromSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaboratorWithUser[]> {
    return this.connection(this.tableName)
      .where({ spaceId })
      .whereIn('userId', collaboratorIds)
      .delete()
      .returning(this.collaboratorFields);
  }
}
