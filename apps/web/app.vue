<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute()

const menuitems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Eseményeink',
    to: '/',
    active: route.path === '/'
  },
  {
    label: '+ Új esemény',
    to: '/event/new',
    active: route.path.startsWith('/event/new')
  },
]);
</script>

<template>
  <UApp>
    <main class="flex flex-col items-center pb-10">
      <header class="flex flex-1 justify-center w-full border-solid border-b-1 border-gray-300">
        <div class="flex justify-between items-center gap-5 w-7xl h-14">
          <h1 class="font-black text-2xl">SensoMedia események</h1>

          <UNavigationMenu :items="menuitems" />
        </div>
      </header>

      <section class="w-7xl">
        <NuxtPage />
      </section>
    </main>
  </UApp>
</template>
