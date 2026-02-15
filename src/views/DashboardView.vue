<script setup>
import { onMounted, ref, computed } from 'vue'
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import Divider from 'primevue/divider';
import BaseInfoWidget from '../components/dashboard/BaseInfoWidget.vue'
import LoginInfoWidget from '../components/dashboard/LoginInfoWidget.vue'
import TrackablesWidget from '@/components/dashboard/TrackablesWidget.vue';
import OwnerCloudWidget from '@/components/dashboard/OwnerCloudWidget.vue';
import SeriesCloudWidget from '@/components/dashboard/SeriesCloudWidget.vue';
import TagsCloudWidget from '@/components/dashboard/TagsCloudWidget.vue';

const widgets = [
  { component: BaseInfoWidget, id: "infowidget" },
  { component: TagsCloudWidget, id: "tagscloudwidget" },
  { component: SeriesCloudWidget, id: "seriescloudwidget" },
  { component: LoginInfoWidget, id: "logininfowidget" },
  { component: OwnerCloudWidget, id: "ownercloudwidget" },
  { component: TrackablesWidget, id: 'trackableswidget' },
];

const evenWidgets = computed(() =>
  widgets.filter((_, index) => index % 2 === 0)
)

const oddWidgets = computed(() =>
  widgets.filter((_, index) => index % 2 !== 0)
)
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <div class="flex w-full">
        <div class="col-12 p-3 pb-0">
          <div class="text-3xl font-bold mb-1">Dashboard</div>
          <Divider class="mb-2 mt-0"></Divider>
        </div>
      </div>

      <div class="flex w-full">
        <div class="col-6">
          <component v-for="(widget, index) in evenWidgets" :key="index"
            :is="widget.component" :storage-key="`dashboard.${widget.id}`"/>
        </div>
        <div class="col-6">
          <component v-for="(widget, index) in oddWidgets" :key="index"
            :is="widget.component" :storage-key="`dashboard.${widget.id}`"/>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Footer/>
    </template>
  </BaseLayout>
</template>
