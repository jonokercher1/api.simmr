import IDbUser from './IDbUser';

interface IDbCollaborator extends IDbUser {
  spaceId: number;
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export default IDbCollaborator;
