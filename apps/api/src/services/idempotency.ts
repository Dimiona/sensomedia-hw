import idempotencyRepository from "../repositories/idempotency.ts";
import { repositoryResponder } from "../utility/repositoryResponder.ts";
import type { TIdempotencyCreateSchema } from "../types/idempotency.d.ts";

class IdempotencyService {
  async createIdempotency(data: TIdempotencyCreateSchema) {
    return await repositoryResponder(() => idempotencyRepository.create(data));
  }

  async getIdempotency(key: string) {
    return await repositoryResponder(() => idempotencyRepository.findBy({ key }));
  }

  async updateIdempotency(key: string, data: TIdempotencyCreateSchema) {
    const exist = await this.getIdempotency(key);
    if (!exist.data && !exist.error) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => idempotencyRepository.updateById(exist.data!._id, data));
  }

  async deleteIdempotency(key: string) {
    const exist = await this.getIdempotency(key);
    if (!exist.data) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => idempotencyRepository.deleteById(exist.data!._id));
  }
}

export default new IdempotencyService();
