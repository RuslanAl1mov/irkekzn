export interface IUser {
  id: number;
  last_login: string;
  date_joined: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  photo: string | null;
  language: string;
  permissions: string[];
}

export interface IUserResponse<T> {
  result: T;
}

export interface IUsersListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IUser[];
}
