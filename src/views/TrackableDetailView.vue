<script setup>
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import LoginPanel from '@/components/LoginPanel.vue';
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:centerstage>
      <h1>Trackable Details</h1>
    </template>
  </BaseLayout>
</template>
