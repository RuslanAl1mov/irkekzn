export interface IColor {
  id: number;
  name: string;
  hex: string;
  is_active: boolean;
}

export interface IColorResponse<T> {
  result: T;
}

export interface IColorPayload {
  name: string;
  hex: string;
  is_active: boolean;
}

export interface IColorsListResponse {
  pages: number;
  count: number;
  active: number;
  next: string | null;
  previous: string | null;
  result: IColor[];
}

