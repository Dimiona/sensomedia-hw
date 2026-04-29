import z from "zod";
import type { TBookingCreateSchema, TBookingResponseSchema } from "@repo/shared/types/booking.d";
import { bookingCreateSchema } from "@repo/shared/schemas";
import type { IAPIRequests } from "~/types/api";

const namespace = "booking";

export default ($request: IAPIRequests) => ({

  create(data: TBookingCreateSchema, idempotencyKey: string) {
    const parsedData = bookingCreateSchema.safeParse(data);
    if (!parsedData.success) {
      throw new Error(z.treeifyError(parsedData.error).errors.join(" "));
    }

    return $request.post<TBookingResponseSchema>(`${namespace}`, data, undefined, { "Idempotency-Key": idempotencyKey });
  },

});
