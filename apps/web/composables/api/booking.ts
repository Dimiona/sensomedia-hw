import z from "zod";
import type { TBookingCreateSchema } from "@repo/shared/types/booking.d";
import type { IAPIRequests } from "../useApiService";
import { eventCreateSchema } from "@repo/shared/schemas";

const namespace = "booking";

export default ($request: IAPIRequests) => ({

  create(data: TBookingCreateSchema, idempotencyKey: string) {
    const parsedData = eventCreateSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error(z.treeifyError(parsedData.error).errors.join(" "));
    }

    return $request.post(`${namespace}`, data, undefined, { "Idempotency-Key": idempotencyKey });
  },

});
