import { getClient, getDatabase } from "../services/database.ts";
import type { TBookingCreateSchema, TBookingResponseSchema } from "../types/booking.d.ts";

class BookingRepository {
  collection() {
    return getDatabase().collection("bookings");
  }

  async getEventRemainingCapacity(eventId: TBookingResponseSchema['eventId'], eventCapacity: number): Promise<number> {
    const result = this.collection().aggregate([
      { $match: { eventId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const asArray = await result.toArray();

    return eventCapacity - asArray[0].total;
  }

  async create(booking: TBookingCreateSchema, eventCapacity: number) {
    const session = getClient().startSession();

    try {
      await session.startTransaction();

      const remainingCapacity = await this.getEventRemainingCapacity(booking.eventId, eventCapacity);
      if (remainingCapacity < booking.quantity) {
        throw new Error('There is not enough remaining capacity for the event.');
      }

      const result = await this.collection().insertOne(booking);

      await session.commitTransaction();
      console.log("Transaction committed.");

      return {
        ...booking,
        _id: result.insertedId,
      };
    }
    catch (e) {
      let errorMessage: string = "Unknown error.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      else if (typeof e === 'string') {
        errorMessage = e;
      }

      console.error(`An error occurred during the transaction: ${errorMessage}`);
      session.abortTransaction();

      throw e;
    }
    finally {
      session.endSession();
    }
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
