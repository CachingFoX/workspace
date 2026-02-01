<script setup>
import { ref, watch, onMounted, onBeforeMount, onUnmounted } from 'vue';
import Tag from 'primevue/tag';


const props = defineProps({
    tags: {
      type: Array,
      required: true,
      default: []
    },
    remove: {
      type: Boolean,
      required: false,
      default: false
    }
});

const emit = defineEmits(['click', 'remove']);

/*
watch(
    () => props.remove,
    (value) => {
      remove.value = value;
      console.log(value);
    }
);

watch(
    () => props.tags,
    (value) => {
      trackable_tags.value = [...value];
    },
    { deep: true }
);
*/

const onClick = (tagId) => {
  emit('click', tagId)
}
const onRemove = (tagId) => {
  emit('remove', tagId)
}

</script>

<template>

    <Tag v-for="item, idx in props.tags" :key="idx"
    :value="item.name" :data-id="item.id"
    class="mr-1 mb-1 small unselectable clickable"
    @click.stop="onClick(item.id)"
    :style="{ cursor: props.remove ? 'default' : 'pointer' }"
    >
      <template #icon v-if="props.remove">
        <span class="p-tag-icon pi pi-times-circle pi-hover" @click.stop="onRemove(item.id)"></span>
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
.pi-hover:hover {
  font-weight: bold;
  cursor: pointer;
}
</style>
