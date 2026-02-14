<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TrackableTag from '@/components/TrackableTag.vue';
import Panel from '@/components/common/panel.vue'
import { seriesService } from "@/di/trackables.js"
import CloudChip from '@/components/dashboard/CloudChip.vue'

const props = defineProps({
  storageKey: { type: String, required: false, default: 'seriescloudwidget' },
});

const max = ref(10);
const more = ref(false);
const progress = ref(true);
const results_raw = ref([]);

const results = computed(() => {
  return results_raw.value; // storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
});

onMounted(() => {
  seriesService.get_all_series().then((e)=>{
    console.log(e);
    results_raw.value = e;
    progress.value = false;
  })
});
</script>

<template>
  <Panel title="Serien" title-icon="pi-list" :storage-key="`${props.storageKey}`" :badge="results.length">
    <div v-if="progress" class="flex w-full justify-content-center">
      <ProgressSpinner/>
    </div>
    <div v-else class="flex flex-wrap gap-1">
      <CloudChip v-for="(item, index) in results" :key="index"
        v-show="(index < max || more)"
        class="mr-1"
        :item="item"
        text-label="series"
        badge-label="count"
        image-label="icon_url"
        icon="pi-user"
        empty-text="not activated"
        empty-icon="pi-times"
        empty-image="https://www.geocaching.com/images/WptTypes/23.gif"
        clickable
        @click="console.log('click', item)"
        />
    </div>

    <div>
      <Button
        :label="more ? 'Weniger Anzeigen' : 'Mehr Anzeigen'"
        :icon="more ? 'pi pi-minus' : 'pi pi-plus'"
        severity="secondary" class="mt-2" size="small"
        v-show="results.length > max"
        @click="more = !more"
      ></Button>
    </div>

  </Panel>
</template>
