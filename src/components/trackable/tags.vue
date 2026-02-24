<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore, useTagsStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import AutoComplete from 'primevue/autocomplete'
import Chip from 'primevue/chip'
import Tag from 'primevue/tag'

const storeTrackable = useTrackableStore();
const storeTags = useTagsStore();
const router = useRouter();

const tags = ref([])
const suggestedTags = ref([])

const notSelectedTags = computed(()=>{
  return storeTags.tags.filter( a => {
    return !tags.value.some(b => a.id == b.id )
  })
})

const search = (event) => {
  let query = event.query.toLowerCase()
  suggestedTags.value = notSelectedTags.value.filter( i => {
    return i.name.toLowerCase().startsWith(query);
  })
}

async function addCustomValue(event) {
  const input = event.target.value.trim()
  const inputLowerCase = input.toLowerCase()
  event.target.value = "";

  if (input.length == 0 ) {
    return;
  }

  const tag = storeTags.tags.find( t => t.name.toLowerCase() == inputLowerCase );
  if (tag) { // tag already exists in database
    if (!tags.value.find( t => t.name.toLowerCase() == inputLowerCase )) {
      storeTrackable.attachTag(tag.id);
      tags.value.push(tag)
    }
  } else {
    const tag = await storeTags.newTag(input)
    storeTrackable.attachTag(tag.id);
    tags.value.push(tag)
  }
}
function onUnselect(event) {
  console.log(event)
  storeTrackable.dettachTag(event.value.id);
}
function onSelect(event) {
  storeTrackable.attachTag(event.value.id);
}

function onClick(tagId) {
  router.push("/tag/"+tagId)
}
function onRemove(event, value, removeCallback) {
  console.log(event, value)
  event.stopPropagation() // verhindert, dass @click ausgelöst wird
  removeCallback(event) // item-select
}

onMounted(()=>{
  tags.value = storeTrackable.tags;
})
</script>

<template>
  <div class="tags-container">
    <AutoComplete
      v-model="tags"
      :suggestions="suggestedTags"
      :typeahead="true"
      multiple
      optionLabel="name"
      @complete="search"
      @keydown.enter="addCustomValue"
      @item-unselect="onUnselect"
      @item-select="onSelect"
      dropdown
      size="normal"
    >
      <template #chip="{ value, removeCallback }">
        <div class="custom-chip no-select">
          <Chip class="chip" :label="value.name" icon="pi pi-tag" removable size="small" @click="onClick(value.id)"
          @remove="onRemove($event, value, removeCallback)"
            :pt="{
              root: { style: { padding: '5px 5px', fontSize: '14px', borderRadius: '8px', 'gap': '0.4rem' } },
              label: { style: { fontSize: '14px' } },
              icon: { style: { marginTop: '2px', padding: '0px 3px' } }
            }"
          />
        </div>
      </template>
    </AutoComplete>
  </div>
</template>

<style scoped>
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;

}
:deep(.p-chip-remove-icon:hover) {
  color: red;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
}
.chip {
  cursor: pointer;
}
</style>
