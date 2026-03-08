<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useAdvancedSearchStore } from '@/stores/AdvancedSearchStore.js'

const route = useRoute();

const storeAdvancedSearch = useAdvancedSearchStore();
const storeTrackables = useTrackableListStore();

const trackables = computed(()=>{
  if (route.query.query?.length) {
    return storeAdvancedSearch.filteredTrackables
  }
  return storeTrackables.trackables
})

onMounted(()=>{
  storeAdvancedSearch.updateURLSearchParameterOn();
  // TODO move it into AdvancedSearchStore
  // take search parameters from URL
  if (route.query.query?.length) {
    storeAdvancedSearch.queryString = route.query.query
    storeAdvancedSearch.types = route.query.types;
  }
})

onUnmounted(()=>{
  storeAdvancedSearch.updateURLSearchParameterOff();
})

</script>

<template>
  <TrackablesSubView :trackables="trackables"/>
</template>
