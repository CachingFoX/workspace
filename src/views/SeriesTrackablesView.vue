<script setup>
import { onMounted, ref, watchEffect, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useTrackableListStore } from '@/di/trackables';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import DataViewTrackables from '@/components/trackables/DataViewTrackables.vue'

const storeTrackables = useTrackableListStore();
const route = useRoute()

const series = ref(null)
const center = ref({})

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(t => t.series == series.value );
})

watchEffect(() => {
  series.value = route.params.series;
  center.value = {
    'label': series.value,
    'icon': 'pi pi-question',
    'avatar': trackables?.value[0]?.icon_url
  }
});
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <DataViewTrackables
        :trackables="trackables"
        :center="center"
      />
    </template>

    <template v-slot:footer>
      <Footer :trackables="trackables"/>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
