<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'

const props = defineProps({
  value: { type: String, default: null, required: true },
  placeholder: { type: String, default: null, required: true },
})

const display = computed(()=>{
  if (!props.value?.length) {
    return props.placeholder
  }
  const date = new Date(props.value + "Z");  // create an UTC string
  const datePart = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium"
  }).format(date);

  const timePart = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "medium"
  }).format(date);
  return `${datePart} ${timePart}`;
})

onBeforeMount(()=>{
})
</script>


<template>
  <PropertySimple
    :value="display"
    clipboard
  />
</template>

<style scoped>
</style>
