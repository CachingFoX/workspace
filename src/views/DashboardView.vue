<script setup>
import { onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/Navbar.vue';
import Divider from 'primevue/divider';
import TagsWidget from '../components/dashboard/TagsWidget.vue'
import InfoWidget from '../components/dashboard/InfoWidget.vue'
import LoginInfoWidget from '../components/dashboard/LoginInfoWidget.vue'
import TrackablesWidget from '@/components/dashboard/TrackablesWidget.vue';

const widgets = [
  { component: InfoWidget },
  { component: TagsWidget },
  { component: LoginInfoWidget },
  { component: TrackablesWidget },
];
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <div class="p-2">
        <div class="text-3xl font-bold xmb-1">Dashboard</div>
        <Divider class="mb-2 mt-0"></Divider>

        <div class="grid w-full">
          <div v-for="(widget, index) in widgets" :key="index" class="col-6">
            <component :is="widget.component" />
          </div>
        </div>

      </div>
    </template>
  </BaseLayout>
</template>
