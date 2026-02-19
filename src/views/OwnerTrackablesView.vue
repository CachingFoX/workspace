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

const owner = ref(null)
const center = ref({})

watchEffect(() => {
  owner.value = route.params.owner
  center.value = {
    'label': owner?.value != "" ? owner?.value : "not activated",
    'icon': owner.value ? 'pi pi-user' : 'pi pi-times',
    'avatar': null // 'https://s3.amazonaws.com/gs-geo-images/cc65b23d-60f6-4e76-93e1-3dccddab9eb3_a.jpg' // null
  }
});

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(item => item.owner == owner.value );
})
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
