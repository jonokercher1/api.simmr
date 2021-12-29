import { Exclude } from 'class-transformer';

export default class UserDTO {
  public id: number;

  public firstName: string;

  public lastName: string;

  public email: string;

  @Exclude()
  public password: string;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial);
  }
}
