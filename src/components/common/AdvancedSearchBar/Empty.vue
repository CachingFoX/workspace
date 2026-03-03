<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import AdvancedSearchItem from '@/components/common/AdvancedSearchBar/Item.vue'
import Button from 'primevue/button'

const props = defineProps({
  model: { Type: String, default: null, required: true }
})

const modelUpperCase = computed(()=>{
  return props.model?.length ? props.model.trim().toUpperCase() : props.model;
})
</script>

<template>
  <AdvancedSearchItem
    :item-label="`Es wurde kein Eintrag für ${props.model} in der Datenbank gefunden.`"
    item-sublabel="Um ein neuen Trackable anzulegen geben sie die vollständigen Tracking Number ein.">
    <template #left>
      <i class="pi pi-question-circle mt-0 ml-0 text-gray-500" style="font-size: 24pt;" />
    </template>
    <template #right>
      <Button v-show="props.model.length >= 6 && !props.model.trim().includes(' ')"
      icon="pi pi-plus"
      :label="`Trackable ${modelUpperCase} hinzufügen`"/>
    </template>
  </AdvancedSearchItem>
</template>
