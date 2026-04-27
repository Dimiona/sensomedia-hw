import type z from "zod";
import { getDatabase } from "../services/database.ts";
import { eventCreateSchema, eventResponseSchema } from "@repo/shared/schemas/event";

export type TEventCreateSchema = z.infer<typeof eventCreateSchema>;
export type TEventResponseSchema = z.infer<typeof eventResponseSchema>;

class EventRepository {
  collection() {
    return getDatabase().collection("events");
  }

  async list(page: number = 1, perpage: number = 10) {
    return this.collection()
      .find()
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * perpage)
      .limit(perpage)
    ;
  }

  async create(event: TEventCreateSchema) {
    const result = await this.collection().insertOne(event);
    return {
      ...event,
      _id: result.insertedId,
    };
  }

  async findById(id: TEventResponseSchema['_id']) {
    return this.collection().findOne({ _id: id });
  }

  async updateById(id: TEventResponseSchema['_id'], event: TEventCreateSchema) {
    return this.collection().findOneAndUpdate(
      { _id: id },
      { $set: event }
    );
  }

  async deleteById(id: TEventResponseSchema['_id']) {
    return this.collection().findOneAndDelete({ _id: id });
  }
}

export default new EventRepository();
