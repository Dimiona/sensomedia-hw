<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <h1 class="font-extrabold text-black-700 text-2xl my-5">{{ props.title }}</h1>
</template>
