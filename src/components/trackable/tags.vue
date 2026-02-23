<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore, useTagsStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import TagList from '@/components/TagList.vue'
import TagSuggestField from '@/components/TagSuggestField.vue'
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import PersistentPanel from '@/components/trackable/panel.vue'

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
}

 async function onNew(tagName) {
  const tag = await storeTags.newTag(tagName)
  console.log("onNew", tag)
  storeTrackable.attachTag(tag.id);
}

function onAdd(tagId) {
  storeTrackable.attachTag(tagId);
}

</script>

<template>
  <PersistentPanel storage-key="trackable.details.tags" title="Schlagwörter" editable
     v-model:editing="editing" :badge="storeTrackable.tags.length" >
    <template #editor>
      <div style="display: inline-flex">
        <InputGroup class="mr-2">
        <TagSuggestField :tags="avaiableTags"
          @new="onNew"
          @add="onAdd"
          @click.stop=""/>
        <Button label="Close" @click="editing = false;"/>
        </InputGroup>
      </div>
    </template>
    <TagList :tags="storeTrackable.tags" @click="onClick" :remove="editing" @remove="onRemove"/>
  </PersistentPanel>
</template>

<style scoped>
</style>
