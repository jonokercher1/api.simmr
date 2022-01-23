import IDbUser from './IDbUser';

export interface IDbCollaborator {
  spaceId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IDbCollaboratorWithUser extends IDbUser {
  spaceId: number;
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
