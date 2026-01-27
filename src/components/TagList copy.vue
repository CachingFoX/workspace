<script setup>
import { ref, watch, onMounted } from 'vue';
import { TagService } from "../services/TagService.js";
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';
import Tag from 'primevue/tag';


const props = defineProps({
    trackableId: {
        type: Number,
        required: true,
    },
});

const input = ref();
const trackable_id = ref(props.trackableId);
const trackable_tags = ref([]);
let trackable_tags_plain = [];
const all_tags = ref();
const selected_tag = ref();
const filteredTags = ref();


watch(
    () => props.trackableId,
    (value) => {
        trackable_id.value = value;
        reloadTrackableTags();
    }
);

const reloadTrackableTags = () => {
  console.log("load tags")
  TagService.getTagsByTrackableId(trackable_id.value).then((result) => {
    console.log("tags are loaded")
    trackable_tags.value = result;
    trackable_tags_plain = result.map((item) => {
        return item.tag.unique_name;
    });
    filterTags2("");
  });
}

const filterTags = (event) => {
  // delay controlled by AutoComplete
  filterTags2(event.query)
  /*setTimeout(()=>{

  }, 250);
  */
}

const filterTags2 = (value) => {
    console.log("calc suggestions")
    if (!all_tags.value) return;
    if (!value.trim().length) {
        // filteredTags.value = [...all_tags.value];
        filteredTags.value = all_tags.value.filter((tag) => {
          return !trackable_tags_plain.includes(tag.unique_name);
        });
    } else {
        filteredTags.value = all_tags.value.filter((tag) => {
          return !trackable_tags_plain.includes(tag.unique_name) && tag.unique_name.startsWith(value.toLowerCase());
        });
    }
}

function onEnter(event) {
  console.log("OnEnter", input.value);
  if (typeof input.value != "string") return;

  // Prüfen, ob der Input in den Vorschlägen enthalten ist
  const match = all_tags.value.find(
    tag => tag.unique_name === input.value.toLowerCase()
  )

  if (match) {
    setTag(trackable_id.value, match.id);
  } else {
    TagService.newTagForTrackableId(trackable_id.value, input.value).then((result) => {
      input.value = "";
      reloadAllTags()
      reloadTrackableTags();
    });
  }
}

// Handler für Auswahl aus Vorschlägen (Click oder Keyboard)
function onOptionSelect(event) {
  setTag(trackable_id.value, event.value.id);
}

function setTag(trackable_id, tag_id) {
  input.value = "";
  TagService.setTagForTrackableId(trackable_id, tag_id).then((result) => {
    reloadTrackableTags();
  });
}

function reloadAllTags() {
  try {

    TagService.getAllTags().then( (result) => {
        all_tags.value = result;
    });
    } catch (err) {
      console.error(err);
    } finally {
  }

}

onMounted(async () => {
  reloadAllTags();
});

const handleIconClick = (tag_id) => {
  console.log(tag_id);

  TagService.removeTagForTrackableId(trackable_id.value, tag_id).then((result)=>{
    reloadTrackableTags();
  });

}


</script>

<template>
  <div>
    <Tag v-for="tag, idx in trackable_tags" :key="idx"
      class="mr-1 mb- small unselectable clickable"
      severity="info" :value="tag.tag.name">
      <template #icon>
        <span class="p-tag-icon pi pi-times-circle pi-hover" @click.stop="handleIconClick(tag.tag.id)"></span>
      </template>
    </Tag>
    <AutoComplete dropdown
      v-model="input"
      optionLabel="name"
      delay="250"
      :suggestions="filteredTags"
      @complete="filterTags"
      @option-select="onOptionSelect"
      @keydown.enter.prevent="onEnter"
    />
  </div>
</template>

<style scoped>
.pi-hover:hover {
  font-weight: bold;
  cursor: pointer;
}
.unselectable {
  user-select: none;          /* Standard */
  -webkit-user-select: none;  /* Für Safari/ältere Chrome-Versionen */
  -moz-user-select: none;     /* Für Firefox */
  -ms-user-select: none;      /* Für alte IE-Versionen */
}
</style>
