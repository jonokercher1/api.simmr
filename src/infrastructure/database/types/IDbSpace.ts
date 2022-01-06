interface IDbSpace {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export default IDbSpace;
