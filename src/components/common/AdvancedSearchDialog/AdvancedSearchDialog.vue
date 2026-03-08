<script setup>
import Dialog from 'primevue/dialog';
import AdvancedSearchBar from '@/components/common/AdvancedSearchDialog/AdvancedSearchBar.vue';
import ToggleSwitch from 'primevue/toggleswitch';
import SelectButton from 'primevue/selectbutton';
import Button from 'primevue/button';
import { useAdvancedSearchStore, ADVANCED_SEARCH_TYPES } from '@/stores/AdvancedSearchStore.js'
import { useRouter } from 'vue-router';

const store = useAdvancedSearchStore();
const router = useRouter();

const visible = defineModel('visible')

const options = [
  { 'name': "Trackables", value: ADVANCED_SEARCH_TYPES.TRACKABLE },
  { 'name': "Schlagwörter", value: ADVANCED_SEARCH_TYPES.TAG },
  { 'name': "Serien", value: ADVANCED_SEARCH_TYPES.SERIES },
]

function onShowResults() {
  router.push({
    path: "/trackables",
    query: {
      query: store.queryString,
      types: store.types
    }
  })
  visible.value = false;
}
</script>

<template>
  <Dialog v-model:visible="visible" modal position="top" :style="{ width: '80%'}">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Advanced Search</span>
      </div>
    </template>
    <div>
      <div class="flex my-2 gap-1 align-items-center justify-content-center" style="z-index: 900;">
        <div>
          <SelectButton v-model="store.types" :options="options" optionLabel="name" optionValue="value" multiple aria-labelledby="multiple" />
        </div>
        <div class="flex-grow-1"/>
        <div>
          <Button label="Trackables in Liste anzeigen"
            @click="onShowResults"
            v-show="store.filteredTrackables.length && store.suggestions.length"/>
        </div>
        <div class="flex-grow-1"/>
        <label class="switch-label">
          <ToggleSwitch v-model="store.grouped" />
          <span>Vorschläge gruppieren</span>
        </label>
      </div>
      <AdvancedSearchBar
        placeholder="Search for trackables, tags and series or add a new trackable"
        @hide="visible = false"
      />
    </div>
  </Dialog>
</template>

<style scoped>
.switch-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
</style>
