import eventRepository from "../repositories/event.ts";
import { repositoryResponder } from "../utility/repositoryResponder.ts";
import type { TEventCreateSchema, TEventResponseSchema } from "../types/event.d.ts";

class EventService {
  async createEvent(data: TEventCreateSchema) {
    return await repositoryResponder(() => eventRepository.create(data));
  }

  async getEvent(id: TEventResponseSchema['_id']) {
    return await repositoryResponder(() => eventRepository.findById(id));
  }

  async updateEvent(id: TEventResponseSchema['_id'], data: TEventCreateSchema) {
    const exist = await this.getEvent(id);
    if (!exist.data && !exist.error) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => eventRepository.updateById(id, data));
  }

  async deleteEvent(id: TEventResponseSchema['_id']) {
    const exist = await this.getEvent(id);
    if (!exist.data && !exist.error) {
      throw new Error('There is no document with the given ID.');
    }
    if (exist.error) {
      return exist;
    }

    return await repositoryResponder(() => eventRepository.deleteById(id));
  }

  async list(page: number = 1, perpage: number = 10) {
    return await repositoryResponder(() => eventRepository.list(page, perpage));
  }
}

export default new EventService();
