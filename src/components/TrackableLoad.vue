<script setup>
import ProgressSpinner from 'primevue/progressspinner';
import CenterLayout from '@/components/layout/CenterLayout.vue';

const props = defineProps({
  text: { type: String, default: "", required: true}
})
</script>

<template>
  <CenterLayout>
    <div class="flex flex-column">
      <div class="text-2xl">{{ props.text }}</div>
      <ProgressSpinner class="mt-2"/>
    </div>
  </CenterLayout>
</template>

<style scoped>
</style>
