import type z from "zod";
import { getDatabase } from "../services/database.ts";
import { bookingCreateSchema, bookingResponseSchema } from "@repo/shared/schemas/booking";

export type TBookingCreateSchema = z.infer<typeof bookingCreateSchema>;
export type TBookingResponseSchema = z.infer<typeof bookingResponseSchema>;

class BookingRepository {
  collection() {
    return getDatabase().collection("bookings");
  }

  async create(booking: TBookingCreateSchema) {
    const result = await this.collection().insertOne(booking);
    return {
      ...booking,
      _id: result.insertedId,
    };
  }

  async findById(id: TBookingResponseSchema['_id']) {
    return this.collection().findOne({ _id: id });
  }

  async updateById(id: TBookingResponseSchema['_id'], booking: TBookingCreateSchema) {
    return this.collection().findOneAndUpdate(
      { _id: id },
      { $set: booking }
    );
  }

  async deleteById(id: TBookingResponseSchema['_id']) {
    return this.collection().findOneAndDelete({ _id: id });
  }
}

export default new BookingRepository();
