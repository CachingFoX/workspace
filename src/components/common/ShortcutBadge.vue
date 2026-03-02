<script setup>
import { computed,ref, watch, onBeforeMount, onMounted, nextTick } from 'vue'

const props = defineProps({
  'keys': { Type: Object, default: [], required: true}
})

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const shortcutDisplay = computed(() => (isMac ? '⌘' : 'Ctrl'))

</script>

<template>
  <div class="shortcut-badge-container">
    <template  v-for="(item, index) in props.keys" :key="index">
     <span class="mr-2" />
      <template v-for="(subitem, sindex) in item" :key="sindex">
        <span v-if="sindex" class="shortcut-badge no-key shortcut-badge">+</span>
        <span class="shortcut-badge key shortcut-badge-key">{{ subitem }}</span>
      </template>
    </template>
  </div>
</template>

<style scoped>
.shortcut-badge-container {
  position: absolute;
  right: 0.5rem; /* Abstand zum rechten Rand */
  top: 45%;
  transform: translateY(-50%);
  z-index: 900;
}

.shortcut-badge {
  color: #333;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
  font-family: monospace;
  user-select: none;
  pointer-events: none;
  background-color: #ffffff;
}

.shortcut-badge.no-key{
  padding: 2px 2px;
  background-color: transparent;
}

.shortcut-badge.key {
  border-radius: 4px;
  border: 1px solid #ccc;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}
</style>
