import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';
import InvalidCredentialsException from '../../exceptions/auth/InvalidCrednetialsException';
import UserNotFoundException from '../../exceptions/auth/UserNotFoundException';
import InvalidTokenException from '../../exceptions/auth/InvalidTokenException';

@injectable()
export default class AuthenticationService {
  constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

  public generateToken(userId: number): string {
    return jwt.sign({}, 'secret', { subject: userId.toString() });
  }

  public async getUserFromToken(token: string): Promise<any> {
    const tokenData = jwt.verify(token, 'secret');

    if (!tokenData || !tokenData.sub) throw new InvalidTokenException();

    return this.userRepository.findOne({ id: Number(tokenData.sub) });
  }

  public async verifyCredentials(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne<any>({ email });

    if (!user) throw new UserNotFoundException();

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) throw new InvalidCredentialsException();

    return user;
  }
}
