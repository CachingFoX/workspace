<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TrackableTag from '@/components/TrackableTag.vue';
import Panel from '@/components/common/panel.vue'
import { ownerService } from "@/di/trackables.js"
import CloudChip from '@/components/dashboard/CloudChip.vue'


const props = defineProps({
  storageKey: { type: String, required: false, default: 'ownercloudwidget' },
});

const max = ref(20);
const more = ref(false);
const progress = ref(true);
const results_raw = ref([]);

const results = computed(() => {
  return results_raw.value; // storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
});

onMounted(() => {
  ownerService.get_all_owners().then((e)=>{
    results_raw.value = e;
    progress.value = false;
  })
});
</script>

<template>
  <Panel title="Eigentümer" title-icon="pi-users" :storage-key="`${props.storageKey}`" :badge="results.length">
    <div v-if="progress" class="flex w-full justify-content-center">
      <ProgressSpinner/>
    </div>
    <div v-else class="flex flex-wrap gap-1">
      <CloudChip v-show="(index < max || more)" class="mr-1" v-for="(item, index) in results" :key="index"
        :item="item"
        text-label="owner"
        badge-label="count"
        icon="pi-user"
        empty-text="not activated"
        empty-icon="pi-times"
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
