<script setup>
import { onMounted, ref } from 'vue'
import { useTokenStore } from '@/di/trackables.js'
import BaseWidget from './BaseWidget.vue';

const storeToken = useTokenStore();
const tokenData = ref({});

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
  <BaseWidget title="Login Information" icon="pi-info-circle">
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
  </BaseWidget>
</template>
