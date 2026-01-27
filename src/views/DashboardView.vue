<script setup>
import 'primeflex/primeflex.css';
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:mainstage>
      <div class="p-1">
        <span class="text-3xl font-bold">Dashboard</span>
        <p>
          <router-link to="/main">Zur Main Page</router-link>
        </p>
      </div>
    </template>
  </BaseLayout>
</template>
