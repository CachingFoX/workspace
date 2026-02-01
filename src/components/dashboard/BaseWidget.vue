<script setup>
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
const props = defineProps({
  title: {
    type: String,
    default: '<unknown>',
    required: true,
  },
  icon: {
    type: String,
    default: '',
    required: false,
  },
  menu: {
    type: Object,
    default: null,
    required: false,
  }
});
</script>

<template>
  <Panel toggleable>
    <template #header>
      <div class="font-bold text-xl" style="color: var(--p-surface-600);">
        <span class="pi mr-1 text-xl font-bold" :class="props.icon" v-if="props.icon"/>
        {{ props.title }}</div>
    </template>
    <template #icons>
      <Button v-if="props.menu" icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
    </template>
    <Divider class="m-0 p-0 mb-4"/>
    <slot/>
  </Panel>
</template>
