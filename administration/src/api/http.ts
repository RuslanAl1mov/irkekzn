export const API_DOMAIN = process.env.REACT_APP_API_DOMAIN as string;

async function handle401or403(
  response: Response,
  url: string,
  options: RequestInit,
  isSafeMethod: boolean
): Promise<Response> {
  try {
    const refreshResponse = await fetch(`${API_DOMAIN}/auth/token/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!refreshResponse.ok) {
      await refreshResponse.json();
      return refreshResponse;
    }

    // повторяем исходный запрос
    const retryResponse = await fetch(url, options);

    if ((retryResponse.status === 401 || retryResponse.status === 403) && !isSafeMethod) {
      await retryResponse.json();
    }

    return retryResponse;
  } catch (err) {
    console.error("Ошибка при обновлении токена:", err);
    throw err;
  }
}

export async function customGet(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    options.method = "GET";
    options.credentials = "include";
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    const isSafeMethod = true;
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.warn(`GET ${response.status}. Пробуем обновить токен.`);
      response = await handle401or403(response, url, options, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customGet:", error);
    throw error;
  }
}

export async function customPost(
  url: string,
  data: unknown,
  options: RequestInit = {},
  contentType = "application/json"
): Promise<Response> {
  try {
    options.method = "POST";
    options.credentials = "include";
    options.headers = {
      ...options.headers,
      "Content-Type": contentType,
    };
    options.body = JSON.stringify(data);

    const isSafeMethod = false;
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.warn(`POST ${response.status}. Пробуем обновить токен.`);
      response = await handle401or403(response, url, options, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customPost:", error);
    throw error;
  }
}

export async function customPostFormData(
  url: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<Response> {
  try {
    if (!(formData instanceof FormData)) {
      throw new Error("customPostFormData: ожидается FormData в качестве второго аргумента");
    }

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      ...options,
      body: formData,
    };

    if (fetchOptions.headers && "Content-Type" in fetchOptions.headers) {
      delete (fetchOptions.headers as Record<string, string>)["Content-Type"];
    }

    let response = await fetch(url, fetchOptions);

    if (response.status === 401 || response.status === 403) {
      console.warn(`POST FormData ${response.status}. Пробуем обновить токен.`);
      const isSafeMethod = false;
      response = await handle401or403(response, url, fetchOptions, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customPostFormData:", error);
    throw error;
  }
}

export async function customPatch(
  url: string,
  data: unknown,
  options: RequestInit = {}
): Promise<Response> {
  try {
    options.method = "PATCH";
    options.credentials = "include";
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
    options.body = JSON.stringify(data);

    const isSafeMethod = false;
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.warn(`PATCH ${response.status}. Пробуем обновить токен.`);
      response = await handle401or403(response, url, options, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customPatch:", error);
    throw error;
  }
}

export async function customPatchFormData(
  url: string,
  fd: FormData,
  options: RequestInit = {}
): Promise<Response> {
  try {
    options.method = "PATCH";
    options.credentials = "include";
    options.headers = {
      ...options.headers,
    };
    options.body = fd;

    const isSafeMethod = false;
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.warn(`PATCH FormData ${response.status}. Пробуем обновить токен.`);
      response = await handle401or403(response, url, options, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customPatchFormData:", error);
    throw error;
  }
}

export async function customDelete(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    options.method = "DELETE";
    options.credentials = "include";
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };

    const isSafeMethod = false;
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.warn(`DELETE ${response.status}. Пробуем обновить токен.`);
      response = await handle401or403(response, url, options, isSafeMethod);
    }

    return response;
  } catch (error) {
    console.error("Ошибка в customDelete:", error);
    throw error;
  }
}
