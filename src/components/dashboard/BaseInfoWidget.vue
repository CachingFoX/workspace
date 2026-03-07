<script setup>
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useBaseStore } from '@/di/trackables.js'
import Panel from '@/components/common/panel.vue'
import { useSafeModel, defineGetterSetter } from '@/components/dashboard/interface.js'
import Select from 'primevue/select';
import { API_ENVIRONMENT_CONFIGURATIONS, getApiBaseUrl, getApiEnvironment, setApiEnvironment } from "@/config/apiConfig"

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

const api_environments = computed(()=>{
  return Object.entries(API_ENVIRONMENT_CONFIGURATIONS).map(([key, value]) => (key))
})

const selectedEndpoint = ref(getApiEnvironment())

function onChange(event) {
  setApiEnvironment(event.value)
  // NOTE: reload app immediately
  window.location.reload()
}

</script>


<template>
  <Panel title="Base Information" title-icon="pi-info-circle" v-model:collapsed="collapsed">
    <div class="grid align-items-center ">
      <!-- known keys -->
      <template v-for="(value, key) in storeBase.baseInfo" :key="key">
        <template v-if="baseProperties[key]">
          <div class="col-3 font-semibold">
            <span class="pi mr-1 text-sm" :class="baseProperties[key].icon"/>
            {{ baseProperties[key].name }}
          </div>
          <div class="col-9 text-sm" style="font-family: monospace, monospace;">{{ value }}</div>
        </template>
      </template>
      <!-- unknown keys -->
      <template v-for="(value, key) in storeBase.baseInfo" :key="key">
        <template v-if="!baseProperties[key]">
          <div class="col-3 font-semibold">
            <span class="pi pi-question mr-1 text-sm"/>
            {{ key }}
          </div>
          <div class="col-9 text-sm" style="font-family: monospace, monospace;">{{ value }}</div>
        </template>
      </template>
      <!-- ... -->
        <div class="col-3 font-semibold">
          <span class="pi pi-question mr-1 text-sm"/>
          API&nbsp;Environment
        </div>
        <div class="col-9 text-sm">
          <Select v-model="selectedEndpoint" :options="api_environments" class="w-full"
          @change="onChange"
           placeholder="Select an API environment" />
        </div>
        <div class="col-3 font-semibold">
          <span class="pi pi-question mr-1 text-sm"/>
          API&nbsp;Base&nbsp;URL
        </div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ getApiBaseUrl() }}
        </div>

    </div>
  </Panel>
</template>
