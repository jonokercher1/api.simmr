import IRepository from './IRepository';
import IDbCollaborator from '../../../../infrastructure/database/types/IDbCollaborator';

interface ICollaboratorRepository extends IRepository {
  getBySpaceId<T = IDbCollaborator>(spaceId: number, returns?: string[]): Promise<T[]>

  getUsersCollaborators(userId: number): Promise<IDbCollaborator[]>

  addNewCollaboratorsToSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaborator[]>

  removeCollaboratorsFromSpace(collaboratorIds: number[], spaceId: number): Promise<IDbCollaborator[]>
}

export default ICollaboratorRepository;
