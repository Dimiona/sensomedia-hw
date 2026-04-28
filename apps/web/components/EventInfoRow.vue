<script setup lang="ts">
const props = defineProps<{
  label: string;
}>();

defineSlots<{
  default(): VNode[];
}>();
</script>

<template>
  <div class="flex items-center gap-1 text-sm">
    <label class="font-bold">{{ props.label }}:</label>
    <slot name="default" />
  </div>
</template>
