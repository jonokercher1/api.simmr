import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import ICollaboratorService from '../../../core/contracts/IICollaboratorService';
import CollaboratorSerializer from '../../serializers/CollaboratorSerializer';
import UnauthorisedActionException from '../../../core/exceptions/auth/UnauthorisedActionException';

type JsonErrorResponse = { message: string };

@singleton()
export default class CollaboratorController {
  constructor(@inject('ICollaboratorService') private collaboratorService: ICollaboratorService) {}

  public async getSpaceCollaborators(context: Context): Promise<JsonErrorResponse>;
  public async getSpaceCollaborators(context: Context): Promise<CollaboratorSerializer[] | JsonErrorResponse> {
    try {
      // TODO: validate request

      const userId = 1; // TODO: get userId from context (context.user.id)

      const spaceId = context.params?.spaceId;

      if (!spaceId) throw new Error('Invalid Space Id');

      const spaceUsers = await this.collaboratorService.getCollaboratorsInSpace<number>(userId, ['users.id']);

      const isUserInSpace = spaceUsers.includes(userId);

      if (!isUserInSpace) throw new UnauthorisedActionException('User does not belong to space');

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
