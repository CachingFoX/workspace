<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/Footer/Item.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'

const storeBase = useBaseStore();

const item = reactive({
  icon: 'pi-database',
  text: computed(()=>{return storeBase.baseInfo['short_name']}),
  tooltip: computed(()=>{
    const x = [
      "Database", storeBase.baseInfo['database_url'],
      "",
      "Upload Path", storeBase.baseInfo['upload_path'],
    ]
    return x.join("\n")
  }),
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
