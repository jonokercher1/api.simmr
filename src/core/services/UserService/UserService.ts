import { inject, injectable } from 'tsyringe';
import { IRegisterData } from '../../../http/requests/RegisterRequest';
import IDbUser from '../../../infrastructure/database/types/IDbUser';
import IUserRepository from '../../contracts/infrastructure/database/IUserRepository';
import UserExistsException from '../../exceptions/database/UserExistsException';
import IUserService from '../../contracts/IUserService';

@injectable()
export default class UserService implements IUserService {
  constructor(@inject('IUserRepository') private userRepository: IUserRepository) {}

  // TODO: We shouldnt be using database interface for service contracts
  public async createUser(inputData: IRegisterData): Promise<IDbUser> {
    const existingUserWithEmail = await this.userRepository.findOne<IDbUser>({ email: inputData.email });

    if (existingUserWithEmail) throw new UserExistsException('email');

    return this.userRepository.insertOne(inputData);
  }

  public async updateUser(user: IDbUser, data: Partial<IDbUser>): Promise<IDbUser> {
    if (data.email) {
      const existingUserWithEmail = await this.userRepository.findByEmailExcludingIds(data.email, [user.id]);

      if (existingUserWithEmail) throw new UserExistsException('email');
    }

    return this.userRepository.update({ email: user.email }, data);
  }
}
