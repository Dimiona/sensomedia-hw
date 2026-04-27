import type z from "zod";
import bookingRepository from "../repositories/booking.ts";
import { repositoryResponder } from "../utility/repositoryResponder.ts";
import type { bookingCreateSchema, bookingResponseSchema } from "@repo/shared/schemas/booking";

export type TBookingCreateSchema = z.infer<typeof bookingCreateSchema>;
export type TBookingResponseSchema = z.infer<typeof bookingResponseSchema>;

class BookingService {
  async createBooking(data: TBookingCreateSchema) {
    return await repositoryResponder(() => bookingRepository.create(data));
  }

  async getBooking(id: TBookingResponseSchema['_id']) {
    return await repositoryResponder(() => bookingRepository.findById(id));
  }

  async updateBooking(id: TBookingResponseSchema['_id'], data: TBookingCreateSchema) {
    const exist = await this.getBooking(id);
    if (!exist) {
      throw new Error('There is no document with the given ID.');
    }

    return await repositoryResponder(() => bookingRepository.updateById(id, data));
  }

  async deleteBooking(id: TBookingResponseSchema['_id']) {
    const exist = await this.getBooking(id);
    if (!exist) {
      throw new Error('There is no document with the given ID.');
    }

    return await repositoryResponder(() => bookingRepository.deleteById(id));
  }
}

export default new BookingService();
