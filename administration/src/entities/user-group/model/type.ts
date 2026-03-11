export interface IUserGroup {
  id: number;
  name: string;
  permissions: string[];
}

export interface IUserGroupsListResponse {
  result: IUserGroup[];
}
