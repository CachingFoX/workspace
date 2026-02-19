<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'
import { geocachingService } from "@/di/trackables.js"

const props = defineProps({
  value: { type: String, default: null, required: true },
})

const menu = ref([]);

onBeforeMount(()=>{
  menu.value.push(
    { icon: 'pi-external-link', link: geocachingService.getLinkGeocachingTrackable(props.value) }
  )
})
</script>

<template>
  <PropertySimple
    :value="value"
    clipboard
    :buttons="menu"
  />
</template>

<style scoped>
a {
  text-decoration: none;
  color: #314155;
}

.main  {
  border: 1px solid transparent;
}



.main:hover  {
  visibility: visible;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.main Button {
  visibility:hidden;
  border-radius: 0px !important;
}

.main Button:last-child{
  visibility:hidden;
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}


.main:hover Button {
  visibility: visible;
}
</style>
