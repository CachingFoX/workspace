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

const tag_id = ref(null)
const tag_name = ref(null)
const center = ref({})

watchEffect(() => {
  tag_id.value = route.params.tag;
  center.value = {
    'label': tag_name.value,
    'icon': 'pi pi-tag',
    'avatar': null
  }
});

const trackables = computed(()=>{
  return storeTrackables.trackables.filter(item => {
    const tag = item.tags.find( t => t.id == tag_id.value )
    tag_name.value = tag ? tag.name : tag_name.value
    return tag ? true : false;
  });
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
