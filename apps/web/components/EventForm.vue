<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import { eventCreateSchema } from '@repo/shared/schemas';
import type { TEventCreateSchema, TEventResponseSchema } from '@repo/shared/types/event.d';

const toast = useToast();
const apiService = useApiService();

const props = defineProps<{
  event?: TEventResponseSchema;
  loading: boolean;
  disabled: boolean;
}>();

const emitter = defineEmits<{
  (event: 'saved', eventData: TEventResponseSchema): void,
}>();

const isSaving = ref<boolean>(false);
const formRef = useTemplateRef('form');

const eventDateAsString = computed<string | undefined>({
  get() {
    if (!(state.date instanceof Date)) {
      return undefined;
    }

    return state.date.toISOString().substring(0, 16);
  },
  set(newVal: string | undefined) {
    state.date = newVal ? new Date(newVal) : undefined;
  }
});

const state = reactive<Partial<TEventCreateSchema>>({
  title: undefined,
  description: undefined,
  date: undefined,
  capacity: 1,
});

const onSubmit = async (event: FormSubmitEvent<TEventCreateSchema>) => {
  if (isSaving.value) {
    return;
  }
  isSaving.value = true;

  toast.clear();

  try {
    const response = await apiService.event.create(event.data satisfies TEventCreateSchema);
    if (!(response instanceof Error)) {
      toast.add({
        title: 'Sikeres beküldés',
        description: 'A foglalásodat rögzítettük.',
        color: 'success',
      });

      emitter('saved', response.payload as TEventResponseSchema);

      formRef.value?.clear();

      return;
    }

    toast.add({
      title: 'Hiba történt a foglalás beküldése során.',
      description: response.data?.error,
      color: 'error',
    });
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
  }
  finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <UForm
    ref="form"
    class="flex flex-col gap-5 max-w-1/4 relative"
    :disabled="props.disabled || isSaving"
    :schema="eventCreateSchema"
    :state="state"
    @submit="onSubmit"
  >
    <UFormField label="Esemény címe" name="title">
      <UInput v-model="state.title" class="w-full" />
    </UFormField>

    <UFormField label="Esemény leírása" name="description">
      <UTextarea v-model="state.description" class="w-full" :rows="8" />
    </UFormField>

    <UFormField label="Esemény férőhely száma" name="capacity">
      <UInput v-model.number="state.capacity" class="w-full" type="number" :min="1" />
    </UFormField>

    <UFormField label="Esemény ideje" name="date">
      <UInput v-model="eventDateAsString" class="w-full" type="datetime-local" />
    </UFormField>

    <UButton
      class="justify-center hover:cursor-pointer"
      icon="i-lucide-save"
      type="submit"
      :loading="isSaving"
    >
      <template v-if="props.event">Módosítás</template>
      <template v-else>Létrehozás</template>
    </UButton>

    <LoadingOverlay v-if="props.loading" label="Adatok betöltése" />
  </UForm>
</template>
