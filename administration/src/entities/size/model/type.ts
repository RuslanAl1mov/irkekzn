export interface ISize {
  id: number;
  russian: string;
  international: string;
  european: string;
  chest_circumference: string;
  waist_circumference: string;
  hip_circumference: string;
  order: number;
}

export interface ISizeResponse<T> {
  result: T;
}

export interface ISizePayload {
  russian: string;
  international: string;
  european: string;
  chest_circumference: string;
  waist_circumference: string;
  hip_circumference: string;
  order?: number;
}

export interface ISizesListResponse {
  pages: number;
  count: number;
  next: string | null;
  previous: string | null;
  result: ISize[];
}
