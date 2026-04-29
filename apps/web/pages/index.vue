<script setup lang="ts">
import { useApiService } from '@/composables/useApiService';
import type { TEventResponseSchema } from '@repo/shared/types/event.d';
import { formatDate } from '~/utility/date';

const DESCRIPTION_TRIM_AFTER_LENGTH: number = 300;

const toast = useToast();

const events = ref<TEventResponseSchema[]>([]);
const isLoading = ref<boolean>(false);
const hasError = ref<boolean>(false);

const fetch = async () => {
  hasError.value = false;

  toast.clear();

  try {
    const response = await useApiService().event.list(1, 100);

    if (!(response instanceof Error)) {
      events.value = response.payload!.items as TEventResponseSchema[];
    }
    else {
      hasError.value = true;

      toast.add({
        title: 'Hiba történt az események lekérdezése során.',
        description: import.meta.dev ? response.data?.error : '',
        color: 'error',
      });
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

    <section v-else class="grid grid-cols-3 gap-10">
      <UCard
        v-for="(event, index) in events"
        :key="`event_${index}_${event._id}`"
      >
        <template #header>
          <RouterLink :to="`/event/${event._id}`" class="font-bold">{{ event.title }}</RouterLink>
        </template>

        <div class="flex flex-col gap-3">
          <p class="text-sm font-medium leading-7">{{ event.description ? (event.description.length > DESCRIPTION_TRIM_AFTER_LENGTH ? (event.description.substring(0, DESCRIPTION_TRIM_AFTER_LENGTH) + '..') : event.description) : '' }}</p>

          <EventInfoRow label="Időpont">
            <time :datetime="(new Date(event.date)).toUTCString()">{{ formatDate(event.date, 'Y-m-d H:i') }}</time>
          </EventInfoRow>

          <EventInfoRow label="Férőhely">
            <span>{{ event.capacity }}</span>
          </EventInfoRow>
        </div>

        <template #footer>
          <UButton
            class="hover:cursor-pointer ml-auto"
            label="Megnézem"
            @click="navigateTo(`/event/${event._id}`)"
          />
        </template>
      </UCard>
    </section>
  </div>
</template>
