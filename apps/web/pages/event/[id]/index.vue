<script setup lang="ts">
import { formatDate } from '~/utility/date';

const router = useRouter();

const goBack = () => router.back();

const { fetch, isLoading, event } = useFetchEvent();

await fetch();
</script>

<template>
  <div>
    <PageTitle title="Esemény oldal" />

    <UButton
      class="hover:cursor-pointer mb-5"
      icon="i-lucide-chevron-left"
      label="Vissza"
      @click="goBack()"
    />

    <article
      v-if="!isLoading && event !== null"
      class="flex flex-col gap-8"
    >
      <h2 class="text-2xl font-medium">{{ event!.title }}</h2>

      <div class="flex flex-col gap-1">
        <label class="text-md font-bold">Esemény leírása:</label>
        <p>{{ event!.description ?? 'Nem tartozik leírás az eseményhez.' }}</p>
      </div>

      <EventInfoRow label="Időpont">
        <time :datetime="(new Date(event.date)).toUTCString()">{{ formatDate(event.date, 'Y-m-d H:i') }}</time>
      </EventInfoRow>

      <EventInfoRow label="Férőhely">
        <span>{{ event.capacity }}</span>
      </EventInfoRow>

      <UButton
        class="hover:cursor-pointer justify-center mt-5"
        icon="i-lucide-shopping-bag"
        label="Foglalok"
        size="xl"
        @click="navigateTo(`/event/${event._id}/booking`)"
      />
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
