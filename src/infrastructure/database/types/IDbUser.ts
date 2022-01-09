interface IDbUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export default IDbUser;
