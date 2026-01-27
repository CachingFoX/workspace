<script setup>
import { ref, watch, onMounted, onBeforeMount, onUnmounted } from 'vue';
import Tag from 'primevue/tag';


const props = defineProps({
    prefix: {
      type: String,
      required: false,
      default: false,
    },
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

const emit = defineEmits(['remove-tag']);
const trackable_tags = ref([]);
const remove = ref(false);

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
      if (props.prefix != "") {
        // auf prefix filter und prefix entfernen
        trackable_tags.value = value.filter((item)=>{
          return item.tag.unique_name.startsWith((props.prefix+": ").toLowerCase());
        });
        trackable_tags.value = trackable_tags.value.map((item)=>{
          // kopien erzeugen und diese verändern
          return { ...item, name: item.tag.name.replace(props.prefix+": ", "") };
        });
      } else {
        trackable_tags.value = [...value];
      }
    },
    { deep: true }
);

onMounted(async () => {
});

const onClick = (event) => {
  if (!remove.value) {
    // TODO
    console.log("click on tag:", event.name);
  }
}
</script>

<template>
  <div class="tag-container" ref="box">
    <Tag v-for="tag, idx in trackable_tags" :key="idx"
      class="mr-1 mb-1 small unselectable clickable"
      severity="info" :value="tag.tag.name"
      @click.stop="onClick(tag.tag)"
      :style="{ cursor: remove ? 'default' : 'pointer' }"
      >
      <template #icon v-if="remove">
        <span class="p-tag-icon pi pi-times-circle pi-hover" @click.stop="emit('remove-tag',tag.tag.id)"></span>
      </template>
    </Tag>
  </div>
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
.tag-container {
}
</style>
