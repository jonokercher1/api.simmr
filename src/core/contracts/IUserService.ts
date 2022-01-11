import { IRegisterData } from '../../http/requests/RegisterRequest';
import IDbUser from '../../infrastructure/database/types/IDbUser';

interface IUserService {
  createUser(data: IRegisterData): Promise<IDbUser>
  updateUser(user: IDbUser, data: Partial<IDbUser>): Promise<IDbUser>
}

export default IUserService;
