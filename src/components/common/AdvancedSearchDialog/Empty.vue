<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import AdvancedSearchItem from '@/components/common/AdvancedSearchDialog/Item.vue'
import Button from 'primevue/button'
import { useAdvancedSearchStore } from '@/stores/AdvancedSearchStore.js'

const store = useAdvancedSearchStore();
</script>

<template>
  <AdvancedSearchItem
    :item-label="`Es wurde kein Eintrag für '${store.queryString}' in der Datenbank gefunden.`"
    item-sublabel="Um ein neuen Trackable anzulegen geben sie die vollständigen Tracking Number ein und drücken Enter.">
    <template #left>
      <i class="pi pi-question-circle mt-0 ml-0 text-gray-500" style="font-size: 24pt;" />
    </template>
    <template #right>
      <Button v-show="store.isQueryStringTrackingNumber"
      icon="pi pi-plus"
      :label="`Trackable ${store.queryStringUpperCase} hinzufügen`"/>
    </template>
  </AdvancedSearchItem>
</template>
