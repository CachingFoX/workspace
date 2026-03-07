<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'

const storeBase = useBaseStore();

const props = defineProps({
  item: { type: [Object, String], default: null, required: true}
})

const item = reactive({
  icon: 'pi-database',
  text: computed(()=>{return storeBase.baseInfo['short_name']}),
  tooltip: computed(()=>{return "Database: " + storeBase.baseInfo['database_url']+"\n\nUpload: "+storeBase.baseInfo['upload_path']}),
  class: "monospace information",
  show: true,
})

onMounted(() => {
  storeBase.init();
});
</script>

<template>
  <FooterItem :item="item"/>
</template>
