import { getDatabase } from "../services/database.ts";
import type { Document, Filter } from "mongodb";
import type { TIdempotencyCreateSchema, TIdempotencyResponseSchema } from "../types/idempotency.d.ts";

class IdempotencyRepository {
  collection() {
    return getDatabase().collection("idempotencies");
  }

  async create(data: TIdempotencyCreateSchema) {
    const result = await this.collection().insertOne(data);
    return {
      ...data,
      _id: result.insertedId,
    };
  }

  async findBy(filter: Filter<Document> = {}) {
    return this.collection().findOne<TIdempotencyResponseSchema>(filter);
  }

  async findById(id: TIdempotencyResponseSchema['_id']) {
    return this.collection().findOne<TIdempotencyResponseSchema>({ _id: id });
  }

  async updateById(id: TIdempotencyResponseSchema['_id'], data: TIdempotencyCreateSchema) {
    return this.collection().findOneAndUpdate(
      { _id: id },
      { $set: data }
    );
  }

  async deleteById(id: TIdempotencyResponseSchema['_id']) {
    return this.collection().findOneAndDelete({ _id: id });
  }
}

export default new IdempotencyRepository();
