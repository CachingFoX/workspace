<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'
import { API_ENVIRONMENT, getApiEnvironment, getApiBaseUrl } from "@/config/apiConfig"

const storeBase = useBaseStore();

const item = reactive({
  icon: 'pi-flag',
  text: computed(()=>{return getApiEnvironment()+":"+storeBase.baseInfo['version']}),
  tooltip: computed(()=>{
    const x = [
      "API Environment:", getApiEnvironment(),
      "",
      "API Version:", storeBase.baseInfo['version'],
      "",
      "API BaseURL:", getApiBaseUrl(),
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
  <FooterItem :item="item" />
</template>
