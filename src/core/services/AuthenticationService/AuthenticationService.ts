import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';

@injectable()
export default class AuthenticationService {
  constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

  public generateToken(userId: number): string {
    return jwt.sign({}, 'secret', { subject: userId.toString() });
  }

  public getUserFromToken(token: string) {
    const tokenData = jwt.verify(token, 'secret');

    if (!tokenData || !tokenData.sub) {
      throw new Error('Invalid token');
    }

    return this.userRepository.findOne({ id: Number(tokenData.sub) });
  }
}
