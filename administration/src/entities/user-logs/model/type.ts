export interface IUserLog {
  id: number;
  user: number;
  method: string;
  old_value: unknown;
  new_value: unknown;
  serializer_class: string | null;
  model_name: string | null;
  date: string;
  content_type: number;
  object_id: number;
}

export interface IUserLogsListResponse {
  pages: number;
  count: number;
  next: string | null;
  previous: string | null;
  result: IUserLog[];
}

