<script setup lang="ts">
import type { TEventResponseSchema } from '@repo/shared/types/event.d';

const { fetch, isLoading, event } = useFetchEvent();

await fetch();
</script>

<template>
  <div>
    <PageTitle :title="`Foglalás a '${event?.title}' eseményre`" />

    <BookingEventForm :event="event as TEventResponseSchema" :loading="isLoading" :disabled="isLoading" />
  </div>
</template>
