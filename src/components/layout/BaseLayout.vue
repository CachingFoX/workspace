<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import CenterLayout from '@/components/layout/CenterLayout.vue';
</script>

<template>
  <div class="baselayout-container">
    <div class="baselayout-header">
      <slot name="header"/>
    </div>
    <div v-if="$slots.mainstage" class="baselayout-mainstage ">
      <div class="scrollable-content h-full">
        <slot name="mainstage"/>
      </div>
    </div>
    <div v-if="$slots.centerstage" class="baselayout-centerstage">
      <CenterLayout>
        <slot name="centerstage"/>
      </CenterLayout>
    </div>
    <div v-if="$slots.footer" class="baselayout-footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<style scoped>
.scrollable-content {
  overflow-y: auto;
  box-sizing: border-box;
}
.baselayout-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.baselayout-header {
  width: 100%;
  /* Höhe passt sich dem Inhalt an */
  flex-shrink: 0;
  background: #fff;
  padding-bottom: 0;
  box-sizing: border-box;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}
.baselayout-mainstage, .baselayout-centerstage {
  width: 100%;
  flex: 1 1 0;
  /*flex-grow: 1;
  flex-shrink: 0;*/
  overflow: hidden;
  background: #fff;
  box-sizing: border-box;
}
.baselayout-footer {
  width: 100%;
  /* Höhe passt sich dem Inhalt an */
  flex-shrink: 0;
  background: #fafafa;
  padding: 1rem;
  padding-bottom: 0.1rem;
  padding-top: 0.1rem;
  box-sizing: border-box;
  border-top: 2px solid #eee;
}
</style>
