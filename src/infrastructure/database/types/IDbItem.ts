interface IDbItem {
  id: number;
  name: string;
  quantity?: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export default IDbItem;
