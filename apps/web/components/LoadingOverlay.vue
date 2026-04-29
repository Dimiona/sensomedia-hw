<script setup lang="ts">
const props = defineProps<{
  label?: string;
}>();
</script>

<template>
  <div class="absolute flex items-center justify-center gap-2 size-full bg-[#ffffff68] backdrop-blur-[1px] text-sm font-medium">
    <Icon name="i-lucide-loader" />
    {{ props.label }}
  </div>
</template>
