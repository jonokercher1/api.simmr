import { inject, singleton } from 'tsyringe';
import { Context } from 'koa';
import { plainToInstance } from 'class-transformer';
import ICollaboratorService from '../../../core/contracts/IICollaboratorService';
import CollaboratorSerializer from '../../serializers/CollaboratorSerializer';
import UnauthorisedActionException from '../../../core/exceptions/auth/UnauthorisedActionException';
import IAuthenticationService from '../../../core/contracts/IAuthenticationService';

type JsonErrorResponse = { message: string };

@singleton()
export default class CollaboratorController {
  constructor(
    @inject('ICollaboratorService') private collaboratorService: ICollaboratorService,
    @inject('IAuthenticationService') private authenticationService: IAuthenticationService,
  ) {}

  public async getSpaceCollaborators(context: Context): Promise<JsonErrorResponse>;
  public async getSpaceCollaborators(context: Context): Promise<CollaboratorSerializer[] | JsonErrorResponse> {
    try {
      // TODO: validate request

      // TODO: refactor into middleware
      const token = context?.headers?.authorization?.replace('Bearer ', '') ?? '';

      const user = await this.authenticationService.getUserFromToken(token);

      const spaceId = context.params?.spaceId;

      if (!spaceId) throw new Error('Invalid Space Id');

      const isUserInSpace = await this.collaboratorService.isCollaboratorInSpace(user.id, spaceId);

      if (!isUserInSpace) throw new UnauthorisedActionException('User does not belong to space');

      const collaborators = await this.collaboratorService.getCollaboratorsInSpace(spaceId, user.id);

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
