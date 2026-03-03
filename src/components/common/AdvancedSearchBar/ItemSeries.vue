<script setup>
import AdvancedSearchItem from '@/components/common/AdvancedSearchBar/Item.vue'

const props = defineProps({
  data: { Type: Object, default: null, required: true }
})
</script>

<template>
  <AdvancedSearchItem
    item-type="Serie"
    :item-label="props.data.series"
    :item-image="props.data.icon_url"
  />
</template>
