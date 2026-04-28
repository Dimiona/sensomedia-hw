import { getDatabase } from "../services/database.ts";
import type { TEventCreateSchema, TEventResponseSchema } from "../types/event.d.ts";

class EventRepository {
  collection() {
    return getDatabase().collection("events");
  }

  async list(page: number = 1, perpage: number = 10) {
    return this.collection()
      .find<TEventResponseSchema>({})
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * perpage)
      .limit(perpage)
      .toArray()
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
    return this.collection().findOne<TEventResponseSchema>({ _id: id });
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
