<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useBaseStore } from '@/di/trackables.js'
import Panel from '@/components/common/panel.vue'
import { useSafeModel, defineGetterSetter } from '@/components/dashboard/interface.js'
import { config } from '@vue/test-utils';

const storeBase = useBaseStore();

/* --- Dashboard widget interface --- */
const localConfiguration = ref({});
const modelConfiguration = defineModel('configuration');
const configuration = useSafeModel(modelConfiguration, localConfiguration, 'configuration');
const collapsed = defineGetterSetter(configuration, "collapsed", false)
/* --------------------------------- */

onMounted(() => {
  storeBase.init();
});

const baseProperties = {
  'short_name': { name: 'Name', icon: 'pi-tag'},
  'version': { name: 'REST API Version', icon: 'pi-asterisk' },
  'database_url': { name: 'Database Location', icon: 'pi-database' },
  'upload_path': { name: 'Upload Folder', icon: 'pi-folder' }
}
</script>


<template>
  <Panel title="Base Information" title-icon="pi-info-circle" v-model:collapsed="collapsed">
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
  </Panel>
</template>
