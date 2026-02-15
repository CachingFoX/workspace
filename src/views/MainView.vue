<script setup>
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <div class="p-1">
        <span class="text-3xl font-bold">MainView</span>
        <p>
          <router-link to="/dashboard">Zum Dashboard</router-link>
        </p>
      </div>
    </template>
  </BaseLayout>
</template>
