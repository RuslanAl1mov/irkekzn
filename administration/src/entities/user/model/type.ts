export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  phone_number: string | null;
  photo: string;
  username: string;
}

export type ApiResult<T> = { result: T };
