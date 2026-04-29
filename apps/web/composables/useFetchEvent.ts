import type { TEventResponseSchema } from "@repo/shared/types/event.d";

export function useFetchEvent() {
  const toast = useToast();
  const route = useRoute();

  const event = ref<TEventResponseSchema | null>(null);
  const isLoading = ref<boolean>(false);

  const fetch = async () => {
    if (isLoading.value) {
      return;
    }

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

        navigateTo('/');
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

      navigateTo('/');
    }
    finally {
      isLoading.value = false;
    }
  };

  return {
    fetch,
    event,
    isLoading,
  };
}
