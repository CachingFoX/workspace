<script setup>
import { onMounted, reactive, ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import DataViewTrackables from '@/components/trackables/DataViewTrackables.vue'

const storeTrackables = useTrackableListStore();
const route = useRoute()

const props = defineProps({
  trackables: { type: Object, default: null, required: true},
  filter: { type: Object, default: null, required: true}
})

const trackables = computed(()=>{
  return props.trackables;
})
const filter = computed(()=>{
  return props.filter;
})

const litems = reactive([
  {
    icon: computed(()=>{return null}),
    text: computed(()=>{return trackables.value.length + " Trackables" }),
    show: true,
  }
])
const ritems = reactive(['database']);
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <DataViewTrackables
        :trackables="trackables"
        :filter="filter"
      />
    </template>
    <template v-slot:footer>
      <Footer :left="litems" :right="ritems"/>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
