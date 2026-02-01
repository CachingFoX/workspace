<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import BaseWidget from './BaseWidget.vue';
import TrackableTag from '@/components/TrackableTag.vue';

import { useBaseStore } from '@/di/trackables.js'
import { useTagsStore } from '@/di/trackables.js'

const storeBase = useBaseStore();
const storeTags = useTagsStore();

onMounted(() => {
  storeBase.init();
  storeTags.load();
});


const tags = computed(() => {
  return storeTags.tags_sorted_by_use_desc.filter(item => item.use > 0);
});

const max = ref(5);
const more = ref(false);
</script>



<template>
  <BaseWidget title="Schlagwörter" icon="pi-tags">

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
  </BaseWidget>
</template>
