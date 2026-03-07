<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useTrackableListStore } from '@/di/trackables.js'
import { API_ENVIRONMENT, getApiEnvironment, getApiBaseUrl } from "@/config/apiConfig"
import { useBaseStore } from '@/stores/base.js'

const storeBase = useBaseStore();

const props = defineProps({
  item: { type: [Object, String], default: null, required: true}
})

const item = reactive({
  icon: 'pi-user',
  text: computed(()=>{return storeBase.username}),
  /*tooltip: computed(()=>{}),*/
  class: "monospace information",
  show: true,
})

onMounted(() => {
});
</script>

<template>
  <FooterItem :item="item" />
</template>
