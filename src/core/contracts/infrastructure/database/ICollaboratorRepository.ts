import IRepository from './IRepository';
import { IDbCollaboratorWithUser } from '../../../../infrastructure/database/types/IDbCollaborator';

interface ICollaboratorRepository extends IRepository {
  getBySpaceId<T = IDbCollaboratorWithUser>(spaceId: number, returns?: string[]): Promise<T[]>

  isCollaboratorInSpace(userId: number, spaceId: number): Promise<boolean>

  getUsersCollaborators(userId: number): Promise<IDbCollaboratorWithUser[]>

  addNewCollaboratorsToSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaboratorWithUser[]>

  removeCollaboratorsFromSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaboratorWithUser[]>
}

export default ICollaboratorRepository;
