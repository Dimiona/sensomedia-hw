<script setup lang="ts">
import { useApiService } from '@/composables/useApiService';
import type { TEventResponseSchema } from '@repo/shared/types/event.d';
import { formatDate } from '~/utility/date';

const toast = useToast();

const generateEvents = (count = 12) => {
  return Array.from({ length: count }, (_, i) => {
    const randomCapacity = Math.floor(Math.random() * 100) + 10; // 10–109
    const futureDate = new Date(
      Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );

    return {
      _id: crypto.randomUUID(),
      capacity: randomCapacity,
      date: futureDate,
      title: `Esemény #${i + 1}`,
      description: 'kjshakjfds fjkdsha fjkdshaf kjdshajkf dhsakjf hdsakjf hdsajkf hdsajkfhsadjk fdskjhfksdjghakjfdsahgf jksdh',
    };
  });
};

const events = ref<TEventResponseSchema[]>(generateEvents());
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);

const fetch = async () => {
  hasError.value = false;

  try {
    const response = await useApiService().event.list(1, 100);
    if (!(response instanceof Error)) {
      events.value = response.payload as TEventResponseSchema[];
    }
    else {
      hasError.value = true;

      toast.add({
        title: 'Hiba történt az események lekérdezése során.',
        color: 'error',
      });

      if (import.meta.dev) {
        toast.add({
          title: `Hiba oka: ${response.message}`,
          color: 'error',
        });
      }
    }
  }
  catch (e: unknown) {
    hasError.value = true;

    let errorMessage: string = 'Ismeretlen hiba.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    else if (typeof e === 'string') {
      errorMessage = e;
    }

    toast.add({
      title: `Hiba oka: ${errorMessage}`,
      color: 'error',
    });
  }
  finally {
    isLoading.value = false;
  }
};

const refetch = () => {
  isLoading.value = true;
  fetch();
};

await fetch();
</script>

<template>
  <div>
    <PageTitle title="Események" />

    <RetryContentFetch
      v-if="hasError && !events.length"
      :callback="() => refetch()"
      :loading="isLoading"
    />

    <section class="grid grid-cols-3 gap-10">
      <UCard
        v-for="(event, index) in events"
        :key="`event_${index}_${event._id.toString()}`"
      >
        <template #header>
          <RouterLink :to="`/event/${event._id.toString()}`" class="font-bold">{{ event.title }}</RouterLink>
        </template>

        <div class="flex flex-col gap-3">
          <p class="text-sm font-medium leading-7">{{ event.description ? (event.description.length > 500 ? (event.description.substring(0, 500) + '..') : event.description) : '' }}</p>

          <div class="flex items-center gap-1 text-sm">
            <label class="font-bold">Időpont:</label>
            <time :datetime="event.date.toUTCString()">{{ formatDate(event.date, 'Y.m.d H:i') }}</time>
          </div>

          <div class="flex items-center gap-1 text-sm">
            <label class="font-bold">Férőhely:</label>
            <span>{{ event.capacity }}</span>
          </div>
        </div>

        <template #footer>
          <UButton
            class="hover:cursor-pointer ml-auto"
            label="Megnézem"
            @click="() => navigateTo(`/event/${event._id.toString()}`)"
          />
        </template>
      </UCard>
    </section>
  </div>
</template>
