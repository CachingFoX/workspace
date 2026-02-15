<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';

import { tagService } from '@/di/trackables.js'
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TrackableTag from '@/components/TrackableTag.vue';
import Panel from '@/components/common/panel.vue'
import { ownerService } from "@/di/trackables.js"
import CloudChip from '@/components/dashboard/CloudChip.vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();

const props = defineProps({
  storageKey: { type: String, required: false, default: 'tagscloudwidget' },
});

const max = ref(20);
const more = ref(false);
const progress = ref(true);
const results_raw = ref([]);

const results = computed(() => {
  return results_raw.value; // storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
});

onMounted(() => {
  tagService.read().then((e)=>{
    results_raw.value = e;
    console.log(e)
    progress.value = false;
  })
});

function onClick(e) {
  console.log(e)
  router.push("/tag/"+e.id)
}
</script>

<template>
  <Panel title="Schlagwörter" title-icon="pi-tags" :storage-key="`${props.storageKey}`" :badge="results.length">
    <div v-if="progress" class="flex w-full justify-content-center">
      <ProgressSpinner/>
    </div>
    <div v-else class="flex flex-wrap gap-1">
      <CloudChip v-for="(item, index) in results" :key="index"
        v-show="(index < max || more)"
        class="mr-1"
        :item="item"
        text-label="name"
        badge-label="use"
        icon="pi-tag"
        empty-text="not activated"
        empty-icon="pi-times"
        empty-image="https://www.geocaching.com/images/WptTypes/23.gif"
        clickable
        @click="onClick"
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
