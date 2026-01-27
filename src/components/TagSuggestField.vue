<script setup>
import { ref, watch, onMounted } from 'vue';
import AutoComplete from 'primevue/autocomplete';

const props = defineProps({
    prefix: {
      type: String,
      required: false,
      default: "",
    },
    tags: {
      type: Array,
      required: true,
      default: []
    }
});

const emit = defineEmits(['unknown-tag','known-tag']);

const input = ref();
const all_tags = ref();
const filteredTags = ref();

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

const filterTags = (value) => {
    console.debug("calc suggestions")
    if (!all_tags.value) return;
    if (!value.trim().length) {
        filteredTags.value = all_tags.value.filter((tag) => {
          return true // TODO schon ausgewählte entfernen
        });
    } else {
        filteredTags.value = all_tags.value.filter((tag) => {
          let x = props.prefix != "" ? props.prefix+": "+value : value;
          let r = true;
          r = r && true // schon ausgewählte entfnern xxx.includes(tag.unique_name); // nicht in der exclude liste
          r = r && tag.unique_name.startsWith(x.toLowerCase()); // typeahead
          return r;
        });
    }
}

function onEnter(event) {
  if (typeof input.value != "string") return;

  // Prüfen, ob der Input in den Vorschlägen enthalten ist
  // TODO prefix!
  const match = !all_tags.value ? null : all_tags.value.find(
    tag => tag.unique_name === input.value.toLowerCase()
  )

  if (match) {
    setTag(match.id);
  } else {
    let new_tag_name = (props.prefix != "" ? props.prefix + ": " :  "") + input.value;
    emit('unknown-tag', new_tag_name);
    input.value = "";
  }
}

// Handler für Auswahl aus Vorschlägen (Click oder Keyboard)
function onOptionSelect(event) {
  setTag(event.value.id);
  input.value = "";
}

function setTag(tag_id) {
  input.value = "";
  emit('known-tag', tag_id);
}

onMounted(async () => {
});
</script>

<template>
  <div>
    <AutoComplete dropdown
      size="small"
      v-model="input"
      optionLabel="name"
      delay="250"
      :suggestions="filteredTags"
      @complete="filterTags($event.query)"
      @option-select="onOptionSelect"
      @keydown.enter.prevent="onEnter"
    />
  </div>
</template>

<style scoped>

</style>
