interface IDbUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export default IDbUser;
