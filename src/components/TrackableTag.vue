<script setup>
import Tag from 'primevue/tag';
import Badge from 'primevue/badge';
import { onMounted, computed, getCurrentInstance } from 'vue'

const props = defineProps({
  tag: {
    type: Object,
    required: true,
  },
  count: {
    type: Boolean,
    default: false,
    required: false,
  },
  /*
  clickable: {
    type: Boolean,
    default: false,
    required: false,
  },
  removable: {
    type: Boolean,
    required: false,
    default: false
  }
    */
});

const instance = getCurrentInstance()

const emit = defineEmits(['click', 'remove']);

const hasClickHandler = computed(() => {
  return !!instance?.vnode.props?.onClick;
});

const hasRemoveHandler = computed(() => {
  return !!instance?.vnode.props?.onRemove;
});


</script>

<template>
  <Tag class="mr-1 mb-1 unselectable">
    <div class="flex items-center gap-2 px-1">
      <span class=""
      :class="hasClickHandler ? 'cursor-pointer pi-hover' : 'font-medium'"
      @click="hasClickHandler ? emit('click', props.tag) : null"
      >{{ props.tag.name }}</span>
      <Badge v-if="props.count" :value="props.tag.use" size="small" severity="warn" class="cursor-default" @click.stop=""></Badge>
    </div>
    <template #icon v-if="hasRemoveHandler">
      <span class="p-tag-icon pi pi-times-circle cursor-pointer pi-hover" @click.stop="emit('remove', props.tag)"></span>
    </template>
    <template #icon v-else>
      <span class="p-tag-icon pi pi-tag cursor-default" @click.stop=""></span>
    </template>
  </Tag>
</template>

<style scoped>
.unselectable {
  user-select: none;          /* Standard */
  -webkit-user-select: none;  /* Für Safari/ältere Chrome-Versionen */
  -moz-user-select: none;     /* Für Firefox */
  -ms-user-select: none;      /* Für alte IE-Versionen */
}
.cursor-default {
  cursor: default;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
