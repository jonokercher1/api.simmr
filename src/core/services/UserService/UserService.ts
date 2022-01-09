import { inject, injectable } from 'tsyringe';
import { IRegisterData } from '../../../http/requests/RegisterRequest';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';
import UserExistsException from '../../exceptions/database/UserExistsException';

@injectable()
export default class UserService {
  constructor(@inject('UserRepository') private userRepository: IUserRepository) {}

  public async createUser(inputData: IRegisterData): Promise<IDbUser> {
    const existingUserWithEmail = await this.userRepository.findOne<IDbUser>({ email: inputData.email });

    if (existingUserWithEmail) throw new UserExistsException('email');

    return this.userRepository.insertOne(inputData);
  }
}
