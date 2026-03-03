<script setup>
import { computed } from 'vue'
import AdvancedSearchItem from '@/components/common/AdvancedSearchBar/Item.vue'

const props = defineProps({
  data: { Type: Object, default: null, required: true }
})

const sublabel = computed(()=>{
  let sublabel = props.data.series
  if (props.data.private_code) {
    sublabel += " • " + props.data.private_code
  }
  if (props.data.public_code) {
    sublabel += " • " + props.data.public_code
  }
  return sublabel
})
</script>

<template>
  <AdvancedSearchItem
    item-type="Trackable"
    item-type-color="success"
    :item-label="props.data.title"
    :item-sublabel="sublabel"
    :item-image="props.data.icon_url"
  />
</template>
