<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import PropertySimple from '@/components/trackable/details/property_simple.vue'
import { geocachingService } from "@/di/trackables.js"
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  value: { type: Object, default: null, required: true },
})

const menu = ref([]);

onBeforeMount(()=>{
  if (props.value.activated) {
    menu.value.push(
      { icon: 'pi-tags', label: 'Alle Trackables', route: "/owner/"+props.value.owner },
    )
    menu.value.push(
      { icon: 'pi-external-link', link: geocachingService.getLinkGeocachingUserProfile(props.value.owner) }
    )
  }
})
</script>

<template>
  <PropertySimple
    :value="props.value.activated ? props.value.owner : 'not activated'"
    :clipboard="props.value.activated ? true : false"
    :icon="props.value.activated ? 'pi-user' : 'pi-times'"
    :buttons="menu"
  />
</template>

<style scoped>
</style>
