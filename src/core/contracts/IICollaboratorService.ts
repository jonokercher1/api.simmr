import { IDbCollaboratorWithUser } from '../../infrastructure/database/types/IDbCollaborator';

interface ICollaboratorService {
  getCollaboratorsInSpace(spaceId: number, excludeUserId?: number, returns?: string[]): Promise<any[]>

  isCollaboratorInSpace(userId: number, spaceId: number): Promise<boolean>

  getUsersCollaborators(currentUserId: number): Promise<IDbCollaboratorWithUser[]>

  updateSpaceCollaborators(spaceId: number, collaboratorIds: number[]): Promise<IDbCollaboratorWithUser[]>
}

export default ICollaboratorService;
