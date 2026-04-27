import type z from "zod";
import eventRepository from "../repositories/events.ts";
import { eventCreateSchema, eventResponseSchema } from "@repo/shared/schemas/event";
import { repositoryResponder } from "../utility/repositoryResponder.ts";

export type TEventCreateSchema = z.infer<typeof eventCreateSchema>;
export type TEventResponseSchema = z.infer<typeof eventResponseSchema>;

class EventService {
  async createEvent(data: TEventCreateSchema) {
    const event = {
      ...data,
      createdAt: new Date()
    };

    return await repositoryResponder(() => eventRepository.create(event));
  }

  async getEvent(id: TEventResponseSchema['_id']) {
    return await repositoryResponder(() => eventRepository.findById(id));
  }

  async updateEvent(id: TEventResponseSchema['_id'], data: TEventCreateSchema) {
    const exist = await this.getEvent(id);
    if (!exist) {
      throw new Error('There is no document with the given ID.');
    }

    return await repositoryResponder(() => eventRepository.updateById(id, data));
  }

  async deleteEvent(id: TEventResponseSchema['_id']) {
    const exist = await this.getEvent(id);
    if (!exist) {
      throw new Error('There is no document with the given ID.');
    }

    return await repositoryResponder(() => eventRepository.deleteById(id));
  }

  async list(page: number = 1, perpage: number = 10) {
    return await repositoryResponder(() => eventRepository.list(page, perpage));
  }
}

export default new EventService();
