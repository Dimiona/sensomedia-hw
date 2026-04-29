import type { RuntimeConfig } from "nuxt/schema";
import type { FetchError } from "ofetch";
import apiEvent from "./api/event";
import apiBooking from "./api/booking";
import type { FetchMetods, IAPIRequests, IAPIResponse, TAPIRequest, TCacheKey } from "~/types/api";

export const useApiService = () => {
  const config: RuntimeConfig = useRuntimeConfig();

  const request: TAPIRequest = async <T>(
    cacheKey: string | undefined = undefined,
    requestPath: string,
    method: FetchMetods = 'GET',
    query: object | undefined = undefined,
    body: object | null = null,
    headers: object = {}
  ): Promise<IAPIResponse<T> | FetchError> => {
    // NOTE: useAsyncData in page COULD NOT work
    // due to a bug with Nuxt's /layouts directory.
    // If it is given, useAsyncData not working as expected
    // as to prevent duplicated API calls on client-side!
    // @see: https://github.com/nuxt/nuxt/issues/13369
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cachedData = ref<any>(null);
    const hasCacheKey = (typeof cacheKey) !== 'undefined';
    if (hasCacheKey) {
      const { data: cachedData } = useNuxtData(cacheKey);
      if (cachedData.value) {
        return Promise.resolve(cachedData.value);
      }
    }

    const defaultHeaders: { [key: string]: string } = {};

    return $fetch(
      requestPath,
      {
        method,
        query,
        body,
        baseURL: `${config.public.apiBaseUrl}/`,
        headers: {
          ...defaultHeaders,
          ...headers
        }
      })
      .then(resp => {
        if (hasCacheKey) {
          cachedData.value = resp;
        }

        return resp as IAPIResponse<T>;
      })
      .catch((e: FetchError) => {
        // Itt lehet kezelni specifikusan az egyes [StatusCode]-kat, pl 401.
        console.error('[API] Error', e);
        return e;
      });
  };

  const apiRequests: IAPIRequests = {
    get: <T>(cacheKey: TCacheKey, requestPath: string, query = {}, headers = {}) => request<T>(cacheKey, requestPath, 'GET', query, null, headers),
    post: <T>(requestPath: string, body = {}, query = {}, headers = {}) => request<T>(undefined, requestPath, 'POST', query, body, headers),
    put: <T>(requestPath: string, body = {}, query = {}, headers = {}) => request<T>(undefined, requestPath, 'PUT', query, body, headers),
    delete: <T>(requestPath: string, body = {}, query = {}, headers = {}) => request<T>(undefined, requestPath, 'DELETE', query, body, headers),
  };

  return {
    event: apiEvent(apiRequests),
    booking: apiBooking(apiRequests),
  };
};
