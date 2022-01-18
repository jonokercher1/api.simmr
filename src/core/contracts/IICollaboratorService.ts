import IDbCollaborator from '../../infrastructure/database/types/IDbCollaborator';

interface ICollaboratorService {
  getCollaboratorsInSpace<T = IDbCollaborator>(spaceId: number, returns?: string[]): Promise<T[]>

  getUsersCollaborators(currentUserId: number): Promise<IDbCollaborator[]>

  updateSpaceCollaborators(spaceId: number, collaboratorIds: number[]): Promise<IDbCollaborator[]>
}

export default ICollaboratorService;
