<script setup>
import Button from 'primevue/button';
import { useTrackableStore } from "@/di/trackables.js"

const storeTrackable = useTrackableStore();

const props = defineProps({
  'trackingNumber': { type: String, default: "", required: true },
})

function onClick() {
  storeTrackable.readTrackableHQ(props.trackingNumber);
}
</script>

<template>
  Unknown {{ props.trackingNumber }}
  <Button @click="onClick">Abfragen</Button>
</template>

<style scoped>
</style>
