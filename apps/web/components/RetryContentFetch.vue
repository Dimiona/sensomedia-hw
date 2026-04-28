<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    callback: () => void;
    loading?: boolean;
    message?: string;
    buttonLabel?: string;
  }>(),
  {
    loading: false,
    message: 'Nem sikerült a tartalom betöltése. Megpróbálja újra?',
    buttonLabel: 'Újra próbálom',
  }
);
</script>

<template>
  <UContainer class="bg-gray-100 h-50 rounded-xl flex items-center">
    <div class="flex flex-col w-full gap-5 items-center">
      <span class="text-gray-600 text-sm">{{ props.message }}</span>
      <UButton
        class="hover:cursor-pointer"
        :label="props.buttonLabel"
        :disabled="props.loading"
        :loading="props.loading"
        @click="props.callback"
      />
    </div>
  </UContainer>
</template>
