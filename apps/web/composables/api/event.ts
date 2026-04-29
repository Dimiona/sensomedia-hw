import z from "zod";
import type { TEventCreateSchema, TEventsResponseSchema } from "@repo/shared/types/event.d";
import { eventCreateSchema } from "@repo/shared/schemas";
import { objectIdSchema } from "@repo/shared/schemas/scaffolding";
import type { IAPIRequests, TCacheKey } from "~/types/api";

const namespace = "event";

export default ($request: IAPIRequests) => ({

  list(page: number = 1, perpage: number = 12) {
    const cacheKey: TCacheKey = `api__${namespace}s__list_${page}_${perpage}`;
    return $request.get<TEventsResponseSchema>(cacheKey, `${namespace}s`, { page, perpage });
  },

  get(id: string) {
    const parsedId = objectIdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new Error("Invalid ID was given.");
    }

    const cacheKey: TCacheKey = `api__${namespace}s__get_${id}`;
    return $request.get(cacheKey, `${namespace}/${id}`);
  },

  create(data: TEventCreateSchema) {
    const parsedData = eventCreateSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error(z.treeifyError(parsedData.error).errors.join(" "));
    }

    return $request.post(`${namespace}`, data);
  },

});
