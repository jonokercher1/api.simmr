import { inject } from 'tsyringe';
import ICollaboratorService from '../../contracts/IICollaboratorService';
import ICollaboratorRepository from '../../contracts/infrastructure/database/ICollaboratorRepository';
import IDbCollaborator from '../../../infrastructure/database/types/IDbCollaborator';

export default class CollaboratorService implements ICollaboratorService {
  constructor(@inject('ICollaboratorRepository') private collaboratorRepository: ICollaboratorRepository) {}

  public async getCollaboratorsInSpace<T = IDbCollaborator>(spaceId: number, returns?: string[]): Promise<T[]> {
    return this.collaboratorRepository.getBySpaceId<T>(spaceId, returns);
  }

  public async getUsersCollaborators(currentUserId: number): Promise<IDbCollaborator[]> {
    return this.collaboratorRepository.getUsersCollaborators(currentUserId);
  }

  public async updateSpaceCollaborators(spaceId: number, collaboratorIds: number[]): Promise<IDbCollaborator[]> {
    const currentSpaceCollaborators = await this.collaboratorRepository.getBySpaceId<number>(spaceId, ['users.id']);

    const collaboratorsRemovedFromSpace = currentSpaceCollaborators.filter((c) => !collaboratorIds.includes(c));

    const collaboratorsAddedToSpace = collaboratorIds.filter((c) => !currentSpaceCollaborators.includes(c));

    await this.collaboratorRepository.removeCollaboratorsFromSpace(collaboratorsRemovedFromSpace, spaceId);

    return this.collaboratorRepository.addNewCollaboratorsToSpace(collaboratorsAddedToSpace, spaceId);
  }
}
