<script setup>
import { onMounted } from 'vue'
import { useBaseStore } from '@/di/trackables.js'
import BaseWidget from './BaseWidget.vue';

const storeBase = useBaseStore();

onMounted(() => {
  storeBase.init();
});

const baseProperties = {
  'version': { name: 'REST API Version', icon: 'pi-tag' },
  'database_url': { name: 'Database Location', icon: 'pi-database' },
  'upload_path': { name: 'Upload Folder', icon: 'pi-folder' }
}
</script>


<template>
  <BaseWidget title="Base Information" icon="pi-info-circle">
    <div class="grid">
      <!-- known keys -->
      <template v-for="(value, key) in storeBase.baseInfo" :key="key">
        <template v-if="baseProperties[key]">
          <div class="col-3 font-semibold">
            <span class="pi mr-1 text-sm" :class="baseProperties[key].icon"/>
            {{ baseProperties[key].name }}</div>
          <div class="col-9 text-sm" style="font-family: monospace, monospace;">{{ value }}</div>
        </template>
      </template>
      <!-- unknown keys -->
      <template v-for="(value, key) in storeBase.baseInfo" :key="key">
        <template v-if="!baseProperties[key]">
          <div class="col-3 font-semibold">
            <span class="pi pi-question mr-1 text-sm"/>
            {{ key }}</div>
          <div class="col-9 text-sm" style="font-family: monospace, monospace;">{{ value }}</div>
        </template>
      </template>
    </div>
  </BaseWidget>
</template>
