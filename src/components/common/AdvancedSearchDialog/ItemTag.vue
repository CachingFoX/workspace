<script setup>
import AdvancedSearchItem from '@/components/common/AdvancedSearchDialog/Item.vue'

const props = defineProps({
  data: { Type: Object, default: null, required: true }
})
</script>

<template>
  <AdvancedSearchItem
    item-type="Schlagwort"
    item-type-color="info"
    :item-label="props.data.name">
    <template #left>
      <i class="pi pi-tag mt-2 ml-2"/>
    </template>
  </AdvancedSearchItem>
</template>
