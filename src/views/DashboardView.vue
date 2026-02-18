<script setup>
import { onMounted, ref, computed, watchEffect } from 'vue'
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
import { useLocalStorageRef } from '@/utils/localStorageRef'

const widgetsCatalog = {
  "infowidget": { component: BaseInfoWidget, default: {} },
  "tagscloudwidget": { component: TagsCloudWidget, default: {} },
  "seriescloudwidget": { component: SeriesCloudWidget, default: {} },
  "logininfowidget": { component: LoginInfoWidget, default: {} },
  "ownercloudwidget": { component: OwnerCloudWidget, default: {} },
  'trackableswidget': { component: TrackablesWidget, default: {} },
};

const dashboardConfiguration = useLocalStorageRef('dashboard', [
  { reference: "tagscloudwidget", configuration: {}}, // configuration must be initilized with an object (instead of null)
  { reference: "infowidget", configuration: {} },
  { reference: "logininfowidget", configuration: {} },
  { reference: "seriescloudwidget", configuration: {} },
  { reference: "ownercloudwidget", configuration: {} },
  { reference: "trackableswidget", configuration: {} },
], 300);

watchEffect(()=>{
  console.log("Dashboard configuartion", dashboardConfiguration.value)
})

const widgets = computed(()=>{
  return dashboardConfiguration.value.map((w) => {
    return {
      component: widgetsCatalog[w.reference].component,
      reference: w.reference,
      configuration: w.configuration,
    }
  });
})

const evenWidgets = computed(() =>
  widgets.value.filter((_, index) => index % 2 === 0)
)

const oddWidgets = computed(() =>
  widgets.value.filter((_, index) => index % 2 !== 0)
)

function onUpdateWidgetConfig(widget, newValue) {
  console.log("widget", widget)
  console.log("newValue", newValue)
  widget.configuration = newValue;
  console.log("widget", widget)
  console.log("Dashboard", dashboardConfiguration.value)
}
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
            :is="widget.component"
            v-model:configuration="widget.configuration"
          />
        </div>
        <div class="col-6">
          <component v-for="(widget, index) in oddWidgets" :key="index"
            :is="widget.component"
            v-model:configuration="widget.configuration"
          />
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <Footer/>
    </template>
  </BaseLayout>
</template>
