<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Panel from 'primevue/panel';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore, useTagsStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import EditMarker from '@/components/Edit.vue'
import TagList from '@/components/TagList.vue'
import TagSuggestField from '@/components/TagSuggestField.vue'
import Button from 'primevue/button';
import Inplace from 'primevue/inplace';

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const storeTags = useTagsStore();

const editing = ref(false);

const avaiableTags = computed(()=>{
  return storeTags.tags;
});

function onRemove(tagId) {
  storeTrackable.dettachTag(tagId);
}

function onClick(tagId) {
  console.log("onClick", tagId)
}

function onNew(tagId) {
  console.log("onNew", tagId)
}

function onAdd(tagId) {
  storeTrackable.attachTag(tagId);
}

function startEditing() {
  editing.value = true
}
</script>

<template>
  <Panel class="m-2" toggleable>
    <template #header>
      <div class="flex align-items-center gap-2">
        <span class="font-bold text-xl" style="color: var(--p-surface-500)">Schlagworte</span>
      </div>
    </template>
    <Inplace v-model:active="editing">
      <!-- Anzeige-Modus -->
      <template #display>
        <span @click="startEditing" class="text-display" style="white-space: pre-line; ">
          <TagList :tags="storeTrackable.tags"
          @click="onClick"/>
        </span>
        <span class="ml-1 pi pi-pencil"></span>
      </template>

      <!-- Bearbeitungsmodus -->
      <template #content>
        <TagList :tags="storeTrackable.tags" remove @remove="onRemove"/>
        <TagSuggestField :tags="avaiableTags"
          @new="onNew"
          @add="onAdd"
          @click.stop=""
        />
        <Button label="Close" @click="editing = false;"/>
      </template>
    </Inplace>



  </Panel>
</template>

<style scoped>
</style>
