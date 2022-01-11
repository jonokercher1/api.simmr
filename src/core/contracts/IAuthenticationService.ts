import IDbUser from '../../infrastructure/database/types/IDbUser';

interface IAuthenticationService {
  generateToken(userId: number): string;
  getUserFromToken(token: string): Promise<IDbUser>;
  verifyCredentials(email: string, password: string): Promise<IDbUser>;
}

export default IAuthenticationService;
