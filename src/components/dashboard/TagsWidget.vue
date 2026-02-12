<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import TrackableTag from '@/components/TrackableTag.vue';
import Panel from '@/components/common/panel.vue'

import { useBaseStore } from '@/di/trackables.js'
import { useTagsStore } from '@/di/trackables.js'

const storeBase = useBaseStore();
const storeTags = useTagsStore();

const props = defineProps({
  storageKey: { type: String, required: false, default: 'tagwidget' },
});

const max = ref(20);
const more = ref(false);

const tags = computed(() => {
  return storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
});

onMounted(() => {
  storeBase.init();
  storeTags.load();
});
</script>

<template>
  <Panel title="Schlagwörter" title-icon="pi-tags" :storage-key="`${props.storageKey}`">
    <template v-for="(item, index) in tags" :key="index">
      <TrackableTag :tag="item" v-show="(index < max || more)"
        count
        @click="console.log('click', item)"
        @_remove="console.log('remove', item)"
        />
    </template>

    <div>
      <Button
        :label="more ? 'Weniger Anzeigen' : 'Mehr Anzeigen'"
        :icon="more ? 'pi pi-minus' : 'pi pi-plus'"
        severity="secondary" class="mt-2" size="small"
        v-show="tags.length > max"
        @click="more = !more"
      ></Button>
    </div>
  </Panel>
</template>
