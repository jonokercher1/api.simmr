import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import ICollaboratorService from '../../../core/contracts/IICollaboratorService';
import CollaboratorSerializer from '../../serializers/CollaboratorSerializer';

@singleton()
export default class CollaboratorController {
  constructor(@inject('ICollaboratorService') private collaboratorService: ICollaboratorService) {}

  public async getSpaceCollaborators(context: Context) {
    try {
      // validate request
      const userId = 1;

      const spaceId = context.params?.spaceId;

      if (!spaceId) throw new Error('Invalid Space Id');

      const spaceUsers = await this.collaboratorService.getCollaboratorsInSpace<number>(userId, ['users.id']);

      const isUserInSpace = spaceUsers.includes(userId);

      if (!isUserInSpace) throw new Error('User is not in space');

      const collaborators = await this.collaboratorService.getCollaboratorsInSpace(spaceId);

      return plainToInstance(CollaboratorSerializer, collaborators);
    } catch (e: any) {
      context.status = 400;

      return {
        message: e?.message ?? 'Unable to get collaborators',
      };
    }
  }

  public async updateSpaceCollaborators(context: Context) {
    // validate request

    const spaceId = context.params?.spaceId;

    if (!spaceId) throw new Error('Invalid space Id');

    // Check user belongs to space

    const collaborators = this.collaboratorService.updateSpaceCollaborators(spaceId, context.request.body);

    return collaborators;
  }
}
