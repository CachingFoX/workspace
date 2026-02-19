<script setup>
import { onMounted, computed } from 'vue'
import Button from 'primevue/button';
import Badge from 'primevue/badge'
import Chip from 'primevue/chip';

const props = defineProps({
  item: { type: Object, default: {}, required: true },
  clickable: { type: Boolean, default: false, required: false },

  textLabel: { type: String, default: null, required: false },
  badgeLabel: { type: String, default: null, required: true },
  imageLabel: { type: String, default: null, required: true },
  icon: { type: String, default: null, required: false },
  emptyText: { type: String, default: null, required: false },
  emptyIcon: { type: String, default: null, required: false }
});

const emit = defineEmits(['click']);

const text = computed(() => {
  let text = props.item[props.textLabel]
  return text?.length ? text : props.emptyText
});
const icon = computed(() => {
  let text = props.item[props.textLabel]
  return text?.length ? props.icon : props.emptyIcon
});
const image = computed(() => {
  let image_url = props.item[props.imageLabel]
  return image_url?.length ? image_url : ""
});

const count = computed(() => {
  return props.item[props.badgeLabel]
});
function onClick(e) {
  if (props.clickable) {
    emit('click', props.item);
  }
}
</script>

<template>
  <Chip :label="text" :image="image" :icon="icon" :class="{ clickable : props.clickable }" @click="onClick">
    <template #default>
      <div class="chip-content">
        <span :class="['pi', icon]" v-if="!image.length"/>
        <img :src="image" class="p-chip-image" v-if="image.length"/>
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
</style>
