<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import AutoComplete from 'primevue/autocomplete';

const props = defineProps({
    tags: {
      type: Array,
      required: true,
      default: []
    }
});

const emit = defineEmits(['add','new']);

const selectedItem = ref();
const suggestedTags = ref([])
const input = ref();

/*
watch(
    () => props.tags,
    (value) => {
      console.debug("new tags", value)
      if (props.prefix != "") {
        // auf prefix filter und prefix entfernen
        all_tags.value = value.filter((item)=>{
          return item.unique_name.startsWith((props.prefix+": ").toLowerCase());
        });
        all_tags.value = all_tags.value.map((item)=>{
          // kopien erzeugen und diese verändern
          return { ...item, name: item.name.replace(props.prefix+": ", "") };
        });
      } else {
        all_tags.value = value;
      }
    },
    { deep: true }
);
*/



function onEnter(event) {

  if (typeof selectedItem.value != "string") return;

  const match = !suggestedTags.value ? null : suggestedTags.value.find(
    tag => tag.unique_name === selectedItem.value.toLowerCase() // TODO unique the input
  )

  if (match) {
    emit('add', match.id)
  } else {
    emit('new', selectedItem.value);
  }
}

function onComplete(event) {
  if (event.query) {
    let tags = [];
    tags = props.tags.filter((tag) => {
      // TODO check space is part of the unique name - if not modify input
      return tag.unique_name.startsWith(event.query.toLowerCase())
    });
    suggestedTags.value = tags;
  } else {
    suggestedTags.value = props.tags;
  }
}

// Handler für Auswahl aus Vorschlägen (Click oder Keyboard)
function onOptionSelect(event) {
  console.log("onOptionSelect", event)
  // TODO event.originalEvent keydown, click
  // by keydown wird auch onEnter aufgerufen
  emit('add', selectedItem.value.id);
  // TODO delete input
}

onMounted(async () => {
});
</script>

<template>
  <AutoComplete dropdown
    size="small"
    v-model="selectedItem"
    optionLabel="name"
    delay="250"
    :suggestions="suggestedTags"
    @complete="onComplete"
    @option-select="onOptionSelect"
    @keydown.enter.prevent="onEnter"
    placeholder="Add a tag"
  />
</template>

<style scoped>
</style>
