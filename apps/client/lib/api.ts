export type ApiBody<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type ApiResponse<T> = ApiBody<T> & {
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  headers: Headers;
};

async function getForwardedHeaders(existingHeaders?: HeadersInit): Promise<Record<string, string>> {
  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (existingHeaders) {
    if (existingHeaders instanceof Headers) {
      existingHeaders.forEach((val, key) => {
        headersObj[key] = val;
      });
    } else if (Array.isArray(existingHeaders)) {
      for (const [key, val] of existingHeaders) {
        headersObj[key] = val;
      }
    } else {
      Object.assign(headersObj, existingHeaders);
    }
  }

  if (typeof window === "undefined") {
    try {
      const { headers } = await import("next/headers");
      const h = await headers();
      const cookie = h.get("cookie");
      if (cookie && !headersObj["cookie"]) {
        headersObj["cookie"] = cookie;
      }
    } catch {
      // In non-request context
    }
  }

  return headersObj;
}

export const get = async <T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const headers = await getForwardedHeaders(options?.headers);

    const response: Response = await fetch(`${baseUrl}/api${url}`, {
      method: "GET",
      headers,
      signal: options?.signal ?? controller.signal,
      ...options,
      credentials: "include",
    });
    clearTimeout(timeoutId);
    const responseBody: ApiBody<T> = await response.json();
    return {
      ...responseBody,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      ok: response.ok,
      headers: response.headers,
    } as ApiResponse<T>;
  } catch (err: unknown) {
    return {
      success: false,
      message: (err as Error).message || "Network request failed",
      status: 500,
      statusText: "Error",
      url: `${baseUrl}/api${url}`,
      ok: false,
      headers: new Headers(),
    } as ApiResponse<T>;
  }
};

export const post = async <T, U = unknown>(
  url: string,
  body?: U,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const headers = await getForwardedHeaders(options?.headers);

  const response: Response = await fetch(`${baseUrl}/api${url}`, {
    method: "POST",
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...options,
    credentials: "include",
  });
  const responseBody: ApiBody<T> = await response.json();
  return {
    ...responseBody,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    ok: response.ok,
    headers: response.headers,
  } as ApiResponse<T>;
};

export const put = async <T, U = unknown>(
  url: string,
  body: U,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const headers = await getForwardedHeaders(options?.headers);

  const response: Response = await fetch(`${baseUrl}/api${url}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    ...options,
    credentials: "include",
  });
  const responseBody: ApiBody<T> = await response.json();
  return {
    ...responseBody,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    ok: response.ok,
    headers: response.headers,
  } as ApiResponse<T>;
};

export const patch = async <T, U = unknown>(
  url: string,
  body: U,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const headers = await getForwardedHeaders(options?.headers);

  const response: Response = await fetch(`${baseUrl}/api${url}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
    ...options,
    credentials: "include",
  });
  const responseBody: ApiBody<T> = await response.json();
  return {
    ...responseBody,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    ok: response.ok,
    headers: response.headers,
  } as ApiResponse<T>;
};

export const del = async <T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const headers = await getForwardedHeaders(options?.headers);

  const response: Response = await fetch(`${baseUrl}/api${url}`, {
    method: "DELETE",
    headers,
    ...options,
    credentials: "include",
  });
  const responseBody: ApiBody<T> = await response.json();
  return {
    ...responseBody,
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    ok: response.ok,
    headers: response.headers,
  } as ApiResponse<T>;
};
