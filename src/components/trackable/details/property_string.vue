<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'

const props = defineProps({
  value: { type: String, default: null, required: true },
  data: { type: Object, default: null, required: false },
  placeholder: { type: String, default: null, required: true },
  editable: { type: Function, default: null, required: true },
  removable: { type: Function, default: null, required: true },
})

const menu = ref([]);

onBeforeMount(()=>{
  if (props.editable) {
    menu.value.push(
      { icon: 'pi-pencil', command: props.editable },
    )
  }
  if (props.removable ) {
    menu.value.push(
      { icon: 'pi-trash', severity: 'danger', command: props.removable }
    )
  }
})
</script>


<template>
  <PropertySimple
    :value="props.value ?? props.placeholder"
    :data="props.data"
    clipboard
    :buttons="menu"
  />
</template>

<style scoped>
</style>
