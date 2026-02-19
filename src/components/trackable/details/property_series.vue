<script setup>
import PropertySimple from '@/components/trackable/details/property_simple.vue'


const props = defineProps({
  value: { type: String, default: null, required: true },
})

const menu = [
  { icon: 'pi-tags', label: 'Alle Trackables', route: "/series/"+props.value },
];
</script>

<template>
  <PropertySimple
    :value="props.value"
    :buttons="menu"
    clipboard
  />
</template>

<style scoped>
</style>
