<script setup>
import PropertySimple from '@/components/trackable/details/property_simple.vue'

const props = defineProps({
  value: { type: String, default: null, required: true },
})
</script>

<template>
  <PropertySimple
    :value="props.value"
    clipboard
  />
</template>

<style scoped>
</style>
