<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import type { FormSubmitEvent } from '@nuxt/ui';
import { bookingCreateSchema } from '@repo/shared/schemas';
import type { TBookingCreateSchema } from '@repo/shared/types/booking.d';
import type { TEventResponseSchema } from '@repo/shared/types/event.d';

const toast = useToast();
const apiService = useApiService();

const props = defineProps<{
  event: TEventResponseSchema;
  loading: boolean;
  disabled: boolean;
}>();

const isSaving = ref<boolean>(false);
const idempotencyKey = ref<string>(uuidv4());

const state = reactive<Partial<TBookingCreateSchema>>({
  eventId: props.event._id,
  customerName: undefined,
  customerEmail: undefined,
  quantity: 1,
  status: 'pending',
});

const onSubmit = async (event: FormSubmitEvent<TBookingCreateSchema>) => {
  if (isSaving.value) {
    return;
  }
  isSaving.value = true;

  toast.clear();

  try {
    const response = await apiService.booking.create(event.data satisfies TBookingCreateSchema, idempotencyKey.value);
    if (!(response instanceof Error)) {
      toast.add({
        title: 'Sikeres beküldés',
        description: 'A foglalásodat rögzítettük.',
        color: 'success',
      });

      navigateTo('/');

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
    class="flex flex-col gap-5 max-w-1/4 relative"
    :disabled="props.disabled || isSaving"
    :schema="bookingCreateSchema"
    :state="state"
    @submit="onSubmit"
  >
    <UFormField label="Megrendelő neve" name="customerName">
      <UInput v-model="state.customerName" class="w-full" />
    </UFormField>

    <UFormField label="Megrendelő email címe" name="customerEmail">
      <UInput v-model="state.customerEmail" class="w-full" />
    </UFormField>

    <UFormField label="Mennyi jegyet foglalsz?" name="quantity">
      <UInput v-model.number="state.quantity" class="w-full" type="number" :min="0" />
    </UFormField>

    <UButton
      class="justify-center hover:cursor-pointer"
      icon="i-lucide-save"
      type="submit"
      :loading="isSaving"
    >
      Beküldés
    </UButton>

    <LoadingOverlay v-if="props.loading" label="Adatok betöltése" />
  </UForm>
</template>
