<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/FooterItem.vue'
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'
import appVersion from '@/config/version.js'

const storeBase = useBaseStore();

const item = reactive({
  icon: 'pi-info-circle',
  text: computed(()=>{return appVersion}),
  tooltip: computed(()=>{
    const x = [
      "Application version", appVersion
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
