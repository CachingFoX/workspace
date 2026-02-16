<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';

import 'primeflex/primeflex.css';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import NavbarIcon from '@/components/common/NavbarIcon.vue';
import Avatar from 'primevue/avatar';
import { useBaseStore, useTrackableListStore } from '@/di/trackables.js'

const storeBase = useBaseStore();
const storeTrackables = useTrackableListStore();

const props = defineProps({
  trackables : { type: Object, default: null, required: false }
})

onMounted(() => {
  storeBase.init();
});


onBeforeUnmount(() => {
})

const baseProperties = {
  'version': { name: 'REST API Version', icon: 'pi-tag' },
  'database_url': { name: 'Database Location', icon: 'pi-database' },
  'upload_path': { name: 'Upload Folder', icon: 'pi-folder' }
}

const trackables = computed(()=>{
  return props.trackables ? props.trackables.length : storeTrackables.items.length;
})
</script>

<template>
  <div class="flex w-full justify-content-between">
    <div>
      <span>{{trackables}} Trackables</span>
    </div>
    <div></div>
    <div class="monospace no-select" v-tooltip.top="storeBase.baseInfo['database_url']">
      <spin class="pi pi-database mr-1"/>{{storeBase.baseInfo['short_name']}}
    </div>
  </div>
</template>

<style scoped>
</style>
