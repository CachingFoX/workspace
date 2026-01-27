<script setup>
import { onMounted } from 'vue'
import 'primeflex/primeflex.css';
import { useRouter, useRoute } from 'vue-router';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import HLayout from '@/components/layout/HLayout.vue';
import Navbar from '@/components/Navbar.vue';
import LoginPanel from '@/components/LoginPanel.vue';
import { useBaseStore } from '../stores/base.js'

const storeBase = useBaseStore();

onMounted(() => {
  storeBase.logout();
});
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar blank/>
    </template>
    <template v-slot:centerstage>
      <HLayout top="1" bottom="2">
        <div class="flex flex-column justify-content-center h-full">
          <h1>Sie wurden abgemeldet.</h1>
          <div class="logout-horizontal-spacer"/>
          <LoginPanel @successful="onSuccessfulLogin"/>
          <div class="logout-horizontal-spacer"/>
        </div>
      </HLayout>
    </template>
  </BaseLayout>
</template>

<style scoped>
.logout-horizontal-spacer {
  height: 3em;
}
</style>
