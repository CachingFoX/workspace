<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import IconField from 'primevue/iconfield';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Textarea from 'primevue/textarea';
import Image from 'primevue/image';
import { useRouter, useRoute } from 'vue-router';
import Galleria from 'primevue/galleria';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "../di/trackables.js"
import TextEdit from './TextEdit.vue'
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
// components
import EditMarker from '../components/Edit.vue'
import TagList from '../components/TagList.vue'
import TagSuggestField from '../components/TagSuggestField.vue'
import Upload from '../components/Upload.vue'
import TrackableGridItem from '../components/TrackableGridItem.vue';
import BaseLayout from './layout/BaseLayout.vue';

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const data = storeTrackable.data;
const isImageLoaded = ref(false)

const xOwner = computed(() => {
  return storeTrackable.activated ? storeTrackable.owner : "not activated"
});

const xDescription = computed({
  get() {
    return storeTrackable.data.description
  },
  set(value) {
    storeTrackable.data.description = value;
  }
})
const xActivationCode = computed({
  get() {
    if (storeTrackable.data.activation_code == undefined || storeTrackable.data.activation_code == null) {
      return ""
    }
    return storeTrackable.data.activation_code
  },
  set(value) {
    console.log("xActivationCode set", value)
    storeTrackable.data.activation_code = value;
  }
})

const items = [
  { 'name': 'Trackable Code', 'model': 'private_code', 'type': 'read-only' },
  { 'name': 'Public Code', 'model': 'public_code', 'type': 'read-only' },
  { 'name': 'Serie', 'model': 'series', 'type': 'read-only' },
  { 'name': 'Owner', 'model': xOwner, 'type': 'read-only' },
  { 'name': 'Created', 'model': 'created', 'type': 'read-only' },
  { 'name': 'Updated', 'model': 'updated', 'type': 'read-only'},
  { 'name': 'Activation Code', 'model': xActivationCode, 'model_name': 'activation_code', 'type': 'edit'},
  { 'name': 'Description', 'model': xDescription, 'model_name': "description", 'type': 'edit', 'textarea': true},
]

function goToListItem(id) {
  router.push("/trackables#trackable-item-"+id)
}

async function onDelete() {
  confirm.require({
    message: 'Möchtest du das Trackable löschen?',
    header: 'Löschen',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
        label: 'Abbrechn',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: 'Löschen',
        severity: 'danger',
    },
    accept: async () => {
      try {
        await storeTrackable.deleteTrackable(data.id);
        router.push('/trackables');
      } catch (error) {
        toast.add({ severity: 'error', summary: 'API Error', detail: error.message, life: 3000 });
        console.log(error);
      }
    },
    reject: () => {}
  })
}

function zzz(x) {
  if (typeof x == 'string') {
    return data[x]
  } else {
    return x.value;
  }
}

function onChange(fields) {
  storeTrackable.updateTrackableFields(fields);
}
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <BaseLayout>
    <template v-slot:header>
      <div class="p-2 pb-0 flex flex-column justify-between items-start gap-0 content-center w-full" >
        <div class="flex gap-1 pb-2" style="border-bottom: 1px solid #ccc;">
          <div style="width: 38px; height: 38px;">
            <Skeleton v-show="!isImageLoaded"
              shape="circle"
              size="100%"
              style="padding: 2px;"/>
            <img v-show="isImageLoaded"
              style="width: 100%"
              :src="`https://www.geocaching.com${data.icon_url}`"
              :alt="data.name"
              @load="isImageLoaded = true;"/>
          </div>
          <div style="flex: 1; align-self: center;">
            <div class="title">{{ data?.title }}</div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:mainstage>
      <div class="grid-container p-2">
        <TrackableGridItem v-for="(item, index) in items" :key="index"
          :label="item.name" :attribute="item.model" :type="item.type">
          <template #read-only>
            <div class="px-2">
              <span class="px-1" style="border: 1px solid transparent;">{{ zzz(item.model) }}</span>
            </div>
          </template>
          <template #edit>
            <TextEdit v-model="item.model.value" :name="item.model_name ?? ''" :textarea="item.textarea" apianswer @save="onChange"/>
          </template>
        </TrackableGridItem>
        <TrackableGridItem label="Tags">
          <EditMarker class="p-1">
            <template #default="defaultProps">
              <TagList :tags="data.tags"
                @remove-tag="removeTag"
                :remove="defaultProps.edit"
              />
            </template>
            <template #edit>
              <div class="flex flex-row justify-content-start align-items-center gap-2">
                <div class="">Add new tag</div>
              <TagSuggestField :trackable-id="data?.private_code"

                @unknown-tag="createNewTag"
                @known-tag="addTag"
                @click.stop=""
                />
                <!-- :tags="tagStore.all_tags"-->
              </div>
            </template>
          </EditMarker>
        </TrackableGridItem>
        <TrackableGridItem label="Pictures">
          <div class="flex flex-row">
            <div class="flex-1 flex align-items-center justify-content-center mx-2 px-1 py-1">

          <Galleria v-model:activeIndex="activeIndex" :value="data.images" class="w-full"
          :responsiveOptions="responsiveOptions" :numVisible="5"
          :showItemNavigators="true"
          >
            <template #item="slotProps">
              <div class="gallery-image-wrapper">
                <img :src="`http://localhost:8000/images/${slotProps.item.filename}`" :alt="slotProps.item.filename" class="gallery-image" />

                <div class="image-controls">
                  <input type="checkbox"/>Primär
                  <button @click="likeImage(index)">❤️ Like</button>
                  <button @click="deleteImage(index)">🗑️ Delete</button>
                </div>
              </div>
            </template>

            <template #thumbnail="slotProps">
              <!-- <div style="border: 1px solid #ccc; border-radius: 8px; width: 96px; height: 96px; " class="p-2"> -->
              <img :src="`http://localhost:8000/images/${slotProps.item.filename}`" :alt="slotProps.item.filename" style="width: 96px;"/>
              <!-- </div> -->
            </template>
          </Galleria>
            </div>
            <div class="flex-1 flex align-items-center justify-content-center mx-2 px-0 py-0">
              <div class="w-full h-full"><Upload :name="data?.private_code" class="w-full h-full"></Upload></div>
            </div>
          </div>


          <div style="width: 100%;" class="mt-2">
            <Upload :name="data?.private_code"></Upload>
          </div>
        </TrackableGridItem>
      </div>
    </template>
    <template v-slot:footer>
      <div class="flex justify-content-end pt-2 pb-2">
        <div class="flex-grow-0 flex-shrink-0">
          <Button @click="goToListItem(data.id)" label="Zurück" icon="pi pi-angle-double-left"/>
        </div>
        <div class="flex-grow-1 flex-shrink-1" style="text-align: center;">
          <Button @click="onDelete" icon="pi pi-trash" label="Löschen"/>
        </div>
        <div class="flex-grow-0 flex-shrink-0">
          <Button @click="" icon="pi pi-refresh" label="Aktualisieren" class="mr-2"/>
          <Button @click="" icon="pi pi-save" label="Speichern" class="mr-2"/>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<style scoped>

  .title {
  margin:0;
  font-size: 26pt;
  font-weight: bold;
}

/* Container für das Grid */
.grid-container {
  display: grid; /* Grid aktivieren */
  grid-template-columns: auto 1fr;
  grid-gap: 10px; /* Abstand zwischen den Elementen */
  padding: 0;
}

/* Grid-Items */
.grid-container > div {
  padding: 0 12px0px;
  text-align: left;
  align-self: center;
}

.grid-container > div:nth-child(odd) {
  font-weight: bold;
}

.grid-container > div.top-left-corner {
  align-self: start;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.gallery-image-wrapper {
  /*
  width: 512px;
  height: 512px;
  */
  width: 384px;
  height: 384px;
  display: flex;
  justify-content: center; /* horizontal zentrieren */
  align-items: center;     /* vertikal zentrieren */
  overflow: hidden;        /* überschüssiges Bild abschneiden */
  background-color: #f5f5f5; /* optional, für leere Flächen */
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Bild skalieren, ohne das Seitenverhältnis zu verzerren */
}

/* Overlay oben rechts */
.image-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}
.image-controls button {
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
}

</style>
