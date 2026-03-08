<script setup>
import { reactive, watch, computed, onMounted, onBeforeMount } from 'vue'
import FooterItem from '@/components/common/Footer/Item.vue'
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
