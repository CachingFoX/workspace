<script setup>
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import HLayout from '@/components/layout/HLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
import LoginPanel from '@/components/LoginPanel.vue';
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar blank/>
    </template>
    <template v-slot:centerstage>
      <HLayout top="1" bottom="2">
        <LoginPanel/>
      </HLayout>
    </template>
  </BaseLayout>
</template>
