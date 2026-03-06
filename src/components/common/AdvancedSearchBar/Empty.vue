<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import AdvancedSearchItem from '@/components/common/AdvancedSearchBar/Item.vue'
import Button from 'primevue/button'

const props = defineProps({
  input: { Type: String, default: null, required: true },
  showButton: { Type: Boolean, default: false, required: false },
})

const inputUpperCase = computed(()=>{
  return props.input?.length ? props.input.trim().toUpperCase() : props.input;
})
</script>

<template>
  <AdvancedSearchItem
    :item-label="`Es wurde kein Eintrag für ${props.input} in der Datenbank gefunden.`"
    item-sublabel="Um ein neuen Trackable anzulegen geben sie die vollständigen Tracking Number ein und drücken Enter.">
    <template #left>
      <i class="pi pi-question-circle mt-0 ml-0 text-gray-500" style="font-size: 24pt;" />
    </template>
    <template #right>
      <Button v-show="props.showButton"
      icon="pi pi-plus"
      :label="`Trackable ${inputUpperCase} hinzufügen`"/>
    </template>
  </AdvancedSearchItem>
</template>
