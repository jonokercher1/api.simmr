import { Type } from 'class-transformer';
import UserDTO from './UserDTO';

export default class GetSelfDTO {
  @Type(() => UserDTO)
  public user: UserDTO;

  public token: string;

  constructor(partial: Partial<GetSelfDTO>) {
    Object.assign(this, partial);
  }
}
