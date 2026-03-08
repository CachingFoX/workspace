<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useTrackableListStore } from '@/di/trackables';
import TrackablesSubView from '@/views/trackables/TrackablesSubView.vue'
import { computed, onMounted, watchEffect } from 'vue'
import { useAdvancedSearchStore } from '@/stores/AdvancedSearchStore.js'

const route = useRoute();
const router = useRouter();
const storeAdvancedSearch = useAdvancedSearchStore();
const storeTrackables = useTrackableListStore();

watchEffect(()=>{
  router.push({
      query: {
        ...route.query,
        query: storeAdvancedSearch.queryString?.length ? storeAdvancedSearch.queryString : null,
        types: storeAdvancedSearch.types?.length ? storeAdvancedSearch.types : null
      }
    })
})

const trackables = computed(()=>{
  console.log("***")
  if (route.query.query?.length) {
    return storeAdvancedSearch.filteredTrackables
  }
  return storeTrackables.trackables
})

onMounted(()=>{
  if (route.query.query?.length) {
    storeAdvancedSearch.queryString = route.query.query
    storeAdvancedSearch.types = route.query.types;
  }
})

</script>

<template>
  <TrackablesSubView :trackables="trackables"/>
</template>
