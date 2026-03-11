export interface IUserPermission {
  id: number;
  name: string;
  codename: string;
  app_label: string;
  model: string;
}

export interface IUserPermissionsListResponse {
  result: IUserPermission[];
}
