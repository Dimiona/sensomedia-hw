<script setup lang="ts">
import type { TEventResponseSchema } from '@repo/shared/types/event.d';

const route = useRoute();
const toast = useToast();

const event = ref<TEventResponseSchema | null>(null);
const isLoading = ref<boolean>(false);

const fetch = async () => {
  isLoading.value = true;

  try {
    const response = await useApiService().event.get(route.params.id as string);
    if (!(response instanceof Error)) {
      event.value = response.payload as TEventResponseSchema;
    }
    else {
      let errorMessage: string = 'Hiba történt az események lekérdezése során.';
      if (
        response.message.includes('404')
        || response.message.includes('not found')
      ) {
        errorMessage = 'A kért esemény nem található.';
      }

      toast.clear();
      toast.add({
        title: errorMessage,
        color: 'error',
      });

      // navigateTo('/');
    }
  }
  catch (e: unknown) {
    let errorMessage: string = 'Ismeretlen hiba.';
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    else if (typeof e === 'string') {
      errorMessage = e;
    }

    toast.clear();
    toast.add({
      title: `Hiba oka: ${errorMessage}`,
      color: 'error',
    });

    // navigateTo('/');
  }
  finally {
    // isLoading.value = false;
  }
};

await fetch();
</script>

<template>
  <div>
    <PageTitle title="Esemény oldal" />

    <article v-if="!isLoading && event !== null">
      <h2 class="text-2xl font-medium">{{ event?.title }}</h2>
    </article>

    <!-- Spinner-t nem találtam a Nuxt UI-ban -->
    <div v-else-if="isLoading" class="flex justify-center">
      <div class="flex flex-col gap-5 mt-10 w-1/2">
        <label class="text-sm font-medium">Betöltés folyamatban..</label>
        <UProgress animation="swing" />
      </div>
    </div>
  </div>
</template>
