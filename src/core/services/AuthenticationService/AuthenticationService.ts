import { inject, injectable } from 'tsyringe';
import UserRepository from '../../../infrastructure/database/repositories/UserRepository';

@injectable()
export default class AuthenticationService {
  constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

  // public async generateToken() {}
}
