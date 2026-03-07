<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import ShortcutBadge from '@/components/common/ShortcutBadge.vue';

const emits = defineEmits(['activate'])

function onShortcut(event) {
  if (event == 'META_k_') {
    emits('activate')
  }
}
</script>

<template>
  <InputGroup @click="emits('activate')">
    <InputGroupAddon>
      <i class="pi pi-search mr-2"></i>
      <span class="pr-7 no-select">Search</span>
      <div style="position: relative; top: -1px; right: -8px">
        <ShortcutBadge
          :shortcuts="[['META', 'k']]"
          :listen="true"
          @shortcut="onShortcut"
        />
      </div>
    </InputGroupAddon>
  </InputGroup>
</template>

<style scoped>
</style>
