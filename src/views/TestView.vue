<script setup>
import { computed, nextTick, ref, onBeforeMount, onMounted, watch } from 'vue'
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import AdvancedSearchBar from '@/components/common/AdvancedSearchBar/AdvancedSearchBar.vue';
import { seriesService } from "@/di/trackables.js"
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

const storeTrackables = useTrackableListStore();
const storeTags = useTagsStore();
const series = ref(null)

const emits = defineEmits(['change'])

onMounted(() => {
  seriesService.get_all_series().then((e)=>{
    console.log(e)
    series.value = e;
  })
});

const visible = ref(false)
</script>

<template>
  <Button label="Show" @click="visible = true" />
  <div class="p-5 w-full">
    <AdvancedSearchBar class="w-full"
      :trackables="storeTrackables.trackables"
      :series="series"
      :tags="storeTags.tags"
      placeholder="Search for trackables, tags and series"
    />
  </div>
  <Dialog v-model:visible="visible" modal position="top" :style="{ width: '80%'}">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Advanced Search</span>
      </div>
    </template>
    <div>
      <AdvancedSearchBar class="w-full"
        :trackables="storeTrackables.trackables"
        :series="series"
        :tags="storeTags.tags"
        placeholder="Search for trackables, tags and series or add a new trackable"
      />
    </div>
  </Dialog>
</template>

<style scoped>

</style>
