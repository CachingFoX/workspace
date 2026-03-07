<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'
import { API_ENVIRONMENT, getApiEnvironment, getApiBaseUrl } from "@/config/apiConfig"

const storeBase = useBaseStore();

const props = defineProps({
  item: { type: [Object, String], default: null, required: true}
})

const item = reactive({
  icon: 'pi-flag',
  text: computed(()=>{return getApiEnvironment()}),
  tooltip: computed(()=>{return "API BaseURL\n" + getApiBaseUrl()+ "\n\nAPI Version: " + storeBase.baseInfo['version']}),
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
