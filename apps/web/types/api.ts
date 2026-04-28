export type TCacheKey = string | undefined;

export type FetchMetods = "GET" | "delete" | "get" | "HEAD" | "PATCH" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "head" | "patch" | "post" | "put" | "connect" | "options" | "trace" | undefined

export interface TAPIRequest {
  <T>(cacheKey: string | undefined, requestPath: string, method: FetchMetods, query: object | undefined, body: object | null, headers: object): Promise<IAPIResponse<T> | FetchError>
}

export interface IAPIRequests {
  get: <T>(cacheKey: TCacheKey, requestPath: string, query?: object, headers?: object) => Promise<(IAPIResponse<T> | FetchError)>,
  post: <T>(requestPath: string, body?: object, query?: object, headers?: object) => Promise<IAPIResponse<T> | FetchError>,
  put: <T>(requestPath: string, body?: object, query?: object, headers?: object) => Promise<IAPIResponse<T> | FetchError>,
  delete: <T>(requestPath: string, body?: object, query?: object, headers?: object) => Promise<IAPIResponse<T> | FetchError>,
}

export type TAPIResponsePayload = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface IAPIResponse<T = TAPIResponsePayload> {
  success: boolean;
  payload: T | null;
}
