import IDbUser from '../../../../infrastructure/database/types/IDbUser';
import IRepository from './IRepository';

interface IUserRepository extends IRepository {
  findByEmailExcludingIds(email: string, ids: number[]): Promise<IDbUser>;
}

export default IUserRepository;
