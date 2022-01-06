import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import InvalidCredentialsException from '../../exceptions/auth/InvalidCrednetialsException';
import UserNotFoundException from '../../exceptions/auth/UserNotFoundException';
import InvalidTokenException from '../../exceptions/auth/InvalidTokenException';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';
import IDbUser from '../../../infrastructure/database/types/IDbUser';

@injectable()
export default class AuthenticationService {
  constructor(@inject('UserRepository') private readonly userRepository: IUserRepository) {}

  public generateToken(userId: number): string {
    return jwt.sign({}, 'secret', { subject: userId.toString() });
  }

  public async getUserFromToken(token: string): Promise<IDbUser> {
    const tokenData = jwt.verify(token, 'secret');
    console.log('🚀 ~ file: AuthenticationService.ts ~ line 20 ~ AuthenticationService ~ getUserFromToken ~ tokenData', tokenData);

    if (!tokenData || !tokenData.sub) throw new InvalidTokenException();

    const u = await this.userRepository.findOne<IDbUser>({ id: Number(tokenData.sub) });
    console.log('🚀 ~ file: AuthenticationService.ts ~ line 25 ~ AuthenticationService ~ getUserFromToken ~ u', u);
    return u;
  }

  public async verifyCredentials(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne<IDbUser>({ email });

    if (!user) throw new UserNotFoundException();

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new InvalidCredentialsException();

    return user;
  }
}
