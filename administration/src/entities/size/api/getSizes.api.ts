import qs from "qs";
import type { AxiosRequestConfig } from "axios";

import $api from "@/api/base";
import type { ISizesListResponse } from "../model/type";

export type SizesListGetParams = {
  search?: string;
  ordering?: string[];
  page?: number;
};

export const getSizes = (
  params: SizesListGetParams,
  config?: AxiosRequestConfig,
) =>
  $api.get<ISizesListResponse>("/administration/sizes/", {
    params,
    paramsSerializer: {
      serialize: (p) => qs.stringify(p, { arrayFormat: "comma" }),
    },
    ...config,
  });
