<script setup lang="ts">
import type { TEventResponseSchema } from '@repo/shared/types/event.d';

const onSaved = (eventData: TEventResponseSchema) => {
  navigateTo(`/event/${eventData._id}`);
};
</script>

<template>
  <div>
    <PageTitle title="Új esemény" />

    <EventForm :loading="false" :disabled="false" @saved="onSaved" />
  </div>
</template>
