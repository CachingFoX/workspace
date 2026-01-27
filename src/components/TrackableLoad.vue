<script setup>
import { ref } from 'vue'
import ProgressSpinner from 'primevue/progressspinner';
import HLayout from './layout/HLayout.vue';
import { useTrackableStore } from '@/di/trackables';

const storeTrackable = useTrackableStore();
</script>

<template>
  <HLayout top="1" bottom="2" centered>
    <ProgressSpinner />
    <div class="text-2xl mt-5">Fetch data for trackable {{storeTrackable.load_code}}</div>
  </HLayout>
</template>

<style scoped>
</style>
