import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import InvalidCredentialsException from '../../exceptions/auth/InvalidCrednetialsException';
import UserNotFoundException from '../../exceptions/auth/UserNotFoundException';
import InvalidTokenException from '../../exceptions/auth/InvalidTokenException';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import IAuthenticationService from '../../contracts/IAuthenticationService';

@injectable()
export default class AuthenticationService implements IAuthenticationService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  public generateToken(userId: number): string {
    return jwt.sign({}, 'secret', { subject: userId.toString() });
  }

  public async getUserFromToken(token: string): Promise<IDbUser> {
    const tokenData = jwt.verify(token, 'secret');

    if (!tokenData || !tokenData.sub) throw new InvalidTokenException();

    return this.userRepository.findOne<IDbUser>({ id: Number(tokenData.sub) });
  }

  public async verifyCredentials(email: string, password: string): Promise<IDbUser> {
    const user = await this.userRepository.findOne<IDbUser>({ email });

    if (!user) throw new UserNotFoundException();

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new InvalidCredentialsException();

    return user;
  }
}
