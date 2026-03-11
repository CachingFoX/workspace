<script setup>
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import Footer from '@/components/common/Footer/Footer.vue';


import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { useBaseStore } from '@/di/trackables.js'
import { useApiStore } from '@/di/trackables.js';
import appVersion from '@/config/version.js'

import Select from 'primevue/select';
import { API_ENVIRONMENT_CONFIGURATIONS, getApiBaseUrl, getApiEnvironment, setApiEnvironment } from "@/config/apiConfig"

const storeApi = useApiStore()

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
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>

    <template v-slot:mainstage>
  <div class="control-center-container">
    <div class="control-center-heading1">Control Center</div>

    <div class="grid align-items-center px-2">
        <div class="col-12 px-0 control-center-heading2">Backend</div>

        <div class="col-3 font-semibold">Environment</div>
        <div class="col-9 text-sm">
          <Select v-model="selectedEndpoint" :options="api_environments" class="w-full"
          @change="onChange"
           placeholder="Select an API environment" />
        </div>

        <div class="col-3 font-semibold">Version</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ storeApi.api_version }}
        </div>

        <div class="col-3 font-semibold">Base&nbsp;URL</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ getApiBaseUrl() }}
        </div>



        <div class="col-3 font-semibold">Name</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ storeApi.api_name }}
        </div>

        <div class="col-3 font-semibold">Database URL</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ storeApi.database_url }}
        </div>

        <div class="col-3 font-semibold">Database Integrity</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ storeApi.database_integrity }}
        </div>


        <div class="col-3 font-semibold">Upload Path</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ storeApi.upload_path }}
        </div>

        <div class="col-12 px-0 control-center-heading2">Frontend</div>

        <div class="col-3 font-semibold">Version</div>
        <div class="col-9 text-sm" style="font-family: monospace, monospace;">
          {{ appVersion }}
        </div>
    </div>
  </div>
     </template>

    <template v-slot:footer>
      <Footer :left="litems" :right="ritems"/>
    </template>

  </BaseLayout>


</template>

<style scoped>
.control-center-container {
  margin: auto;
  margin-top: 1rem;
  width: 800px;
  padding: 0.5rem;
  border: 1px solid lightgray;
  background-color: white;
  border-radius: 5px;
}
.control-center-heading1 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.35rem;
  border-bottom: 2px solid lightgray;
  font-size: 24pt;
  font-weight: bold;
}
.control-center-heading2 {
  border-bottom: 1px solid lightgray;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.35rem;
  font-size: 18pt;
  font-weight: bold;
}
</style>
