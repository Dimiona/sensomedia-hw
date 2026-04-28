import bookingRepository from "../repositories/booking.ts";
import { repositoryResponder } from "../utility/repositoryResponder.ts";
import type { TBookingCreateSchema, TBookingResponseSchema } from "../types/booking.d.ts";

class BookingService {
  async createBooking(data: TBookingCreateSchema, eventCapacity: number) {
    return await repositoryResponder(() => bookingRepository.create(data, eventCapacity));
  }

  async getBooking(id: TBookingResponseSchema['_id']) {
    return await repositoryResponder(() => bookingRepository.findById(id));
  }

  async updateBooking(id: TBookingResponseSchema['_id'], data: TBookingCreateSchema) {
    const exist = await this.getBooking(id);
    if (!exist.data && !exist.error) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => bookingRepository.updateById(id, data));
  }

  async deleteBooking(id: TBookingResponseSchema['_id']) {
    const exist = await this.getBooking(id);
    if (!exist.data && !exist.error) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => bookingRepository.deleteById(id));
  }
}

export default new BookingService();
