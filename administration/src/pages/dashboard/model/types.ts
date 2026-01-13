export interface DashboardItemBase {
  total: number;
  diff: number;
  prev: number;
}

export interface IDashboardResult {
  date_after: string;
  date_before: string;
  products: DashboardItemBase;
  categories: DashboardItemBase;
  call_requests: DashboardItemBase;
}

export interface IDashboard {
  result: IDashboardResult;
}