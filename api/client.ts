export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = { signal?: AbortSignal };

const handle = async <T>(res: Response): Promise<T> => {
  const data = (await res.json().catch(() => null)) as
    | (T & { error?: string })
    | null;
  if (!res.ok) {
    const message =
      data && typeof data === "object" && data.error
        ? data.error
        : "Request failed";
    throw new ApiError(message, res.status);
  }
  return data as T;
};

export const apiGet = async <T>(
  path: string,
  options?: RequestOptions,
): Promise<T> => {
  const res = await fetch(path, { signal: options?.signal });
  return handle<T>(res);
};

export const apiPost = async <T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> => {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: options?.signal,
  });
  return handle<T>(res);
};
