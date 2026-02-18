<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTokenStore } from '@/di/trackables.js'
import Panel from '@/components/common/panel.vue'
import { useModel, defineGetterSetter } from '@/components/dashboard/interface.js'

const storeToken = useTokenStore();
const tokenData = ref({});

/* --- Dashboard widget interface --- */
const localConfiguration = ref({});
const modelConfiguration = defineModel('configuration');
const configuration = useModel(modelConfiguration, localConfiguration);
const collapsed = defineGetterSetter(configuration, "collapsed", false)
/* Note: do not use configuration.collapse directly
  nur über computed getter/setter auf configuration members zugreifen, ansonsten gibt es probleme beim speichern */
/* --------------------------------- */

onMounted(async () => {
  tokenData.value = await storeToken.verify();
});

const baseProperties = {
  'name': { name: 'Benutzer', icon: 'pi-user' },
  'role': { name: 'Rolle', icon: 'pi-asterisk' },
  'avatar': { name: 'Avatar', icon: 'pi-image' }
}
</script>


<template>
  <Panel title="Login Information" title-icon="pi-info-circle" v-model:collapsed="collapsed">
    <div class="grid">
      <!-- known keys -->
      <template v-for="(value, key) in tokenData" :key="key">
        <template v-if="baseProperties[key]">
          <div class="col-3 font-semibold">
            <span class="pi mr-1 text-sm" :class="baseProperties[key].icon"/>
            {{ baseProperties[key].name }}</div>
          <div class="col-9 text-sm" style="font-family: monospace, monospace;">{{ value }}</div>
        </template>
      </template>
      <!-- unknown keys -->
      <template v-for="(value, key) in tokenData" :key="key">
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
