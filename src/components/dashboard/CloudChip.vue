<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge'
import Chip from 'primevue/chip';

const props = defineProps({
  item: { type: Object, default: {}, required: true },
  clickable: { type: Boolean, default: false, required: false },

  avatar: { type: String, default: null, required: true },
  count: { type: String, default: null, required: true },
  icon: { type: String, default: null, required: true },
  image: { type: String, default: null, required: true },
  text: { type: String, default: null, required: true },
});

const emit = defineEmits(['click']);

const avatar = computed(() => {
  return props.avatar
});
const count = computed(() => {
  return props.count
});
const icon = computed(() => {
  return props.icon
});
const image = computed(() => {
  return props.image
});
const text = computed(() => {
  return props.text
});

function onClick(e) {
  if (props.clickable) {
    emit('click', props.item);
  }
}
</script>

<template>
  <Chip :class="{ clickable : props.clickable }" @click="onClick">
    <template #default>
      <div class="chip-content">
        <Avatar :label="avatar" shape="circle" v-if="avatar"/>
        <span :class="['pi', icon]" v-if="icon" />
        <img :src="image" class="p-chip-image" v-if="image" />
        <span class="label no-select">{{text}}</span>
        <Badge :value="count" severity="info" />
      </div>
    </template>
  </Chip>
</template>

<style scoped>
.chip-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.p-chip:hover {
  background-color: lightblue;
}
.p-avatar {
  background: var(--p-badge-warn-background);
  color: var(--p-badge-warn-color);
}
</style>
