<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'

const storeBase = useBaseStore();

const props = defineProps({
  item: { type: Object, default: null, required: true}
})

const item = reactive({
  icon: 'pi-database',
  text: computed(()=>{return storeBase.baseInfo['short_name']}),
  tooltip: computed(()=>{return storeBase.baseInfo['database_url']}),
  class:"monospace",
  show: true,
})

onMounted(() => {
  storeBase.init();
});
</script>

<template>
  <FooterItem :item="item"/>
</template>
