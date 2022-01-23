import { inject, injectable } from 'tsyringe';
import ICollaboratorService from '../../contracts/IICollaboratorService';
import ICollaboratorRepository from '../../contracts/infrastructure/database/ICollaboratorRepository';
import { IDbCollaboratorWithUser } from '../../../infrastructure/database/types/IDbCollaborator';

@injectable()
export default class CollaboratorService implements ICollaboratorService {
  constructor(@inject('ICollaboratorRepository') private collaboratorRepository: ICollaboratorRepository) {}

  public async getCollaboratorsInSpace(spaceId: number, excludeUserId?: number, returns?: string[]): Promise<any[]> {
    if (excludeUserId) {
      return this.collaboratorRepository.getUsersCollaborators(excludeUserId);
    }

    return this.collaboratorRepository.getBySpaceId(spaceId, returns);
  }

  public async isCollaboratorInSpace(userId: number, spaceId: number): Promise<boolean> {
    return this.collaboratorRepository.isCollaboratorInSpace(userId, spaceId);
  }

  public async getUsersCollaborators(currentUserId: number): Promise<IDbCollaboratorWithUser[]> {
    return this.collaboratorRepository.getUsersCollaborators(currentUserId);
  }

  public async updateSpaceCollaborators(spaceId: number, collaboratorIds: number[]): Promise<IDbCollaboratorWithUser[]> {
    const currentSpaceCollaborators = await this.collaboratorRepository.getBySpaceId<number>(spaceId, ['users.id']);

    const collaboratorsRemovedFromSpace = currentSpaceCollaborators.filter((c) => !collaboratorIds.includes(c));

    const collaboratorsAddedToSpace = collaboratorIds.filter((c) => !currentSpaceCollaborators.includes(c));

    await this.collaboratorRepository.removeCollaboratorsFromSpace(collaboratorsRemovedFromSpace, spaceId);

    return this.collaboratorRepository.addNewCollaboratorsToSpace(collaboratorsAddedToSpace, spaceId);
  }
}
