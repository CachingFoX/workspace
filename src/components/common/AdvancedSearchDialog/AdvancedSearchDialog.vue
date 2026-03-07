<script setup>
import { ref, watch, computed, onMounted, nextTick, watchEffect } from 'vue'
import Dialog from 'primevue/dialog';
import AdvancedSearchBar from '@/components/common/AdvancedSearchDialog/AdvancedSearchBar.vue';
import { useBaseStore } from '@/stores/base.js'
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import { seriesService } from "@/di/trackables.js"
import { API_ENVIRONMENT, getApiEnvironment } from "@/config/apiConfig"

const visible = defineModel('visible')

const storeTrackables = useTrackableListStore();
const storeTags = useTagsStore();
const series = ref(null)


onMounted(() => {
  seriesService.get_all_series().then((e)=>{
    series.value = e;
  })
});
</script>

<template>
  <Dialog v-model:visible="visible" modal position="top" :style="{ width: '80%'}">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Advanced Search</span>
      </div>
    </template>
    <div>
      <AdvancedSearchBar
        :trackables="storeTrackables.trackables"
        :series="series"
        :tags="storeTags.tags"
        placeholder="Search for trackables, tags and series or add a new trackable"
        @select="visible = false"
      />
    </div>
</Dialog>
</template>
