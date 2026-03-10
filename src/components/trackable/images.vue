<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Galleria from 'primevue/galleria';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Panel from 'primevue/panel';
import { useTrackableStore } from "@/di/trackables.js"
import { useLocalStorageRef } from '@/utils/localStorageRef';
import { imageUrl } from "@/utils/imageUrl"

// components
import PersistentPanel from '@/components/trackable/panel.vue'
import { generateKeyBetween } from 'fractional-indexing';


const storeTrackable = useTrackableStore();
const collapsed = useLocalStorageRef('details.layout.images.collapsed', false)

function onRemoveImage() {
  let x = storeTrackable.images.length;
  if (activeIndex.value >= 0 && activeIndex.value < x ) {
    let image_id = storeTrackable.images[activeIndex.value].id;
    let newMaxIndex = Math.max(0, x-2)
    let newActiveIndex = activeIndex.value - 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
    newActiveIndex = Math.min(newActiveIndex, newMaxIndex);
    activeIndex.value = newActiveIndex
    console.log(newActiveIndex)
    storeTrackable.deleteImage(image_id);
  }
}

onBeforeMount(()=>{
})

const activeIndex = ref(0)

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const visible = computed(() =>
  storeTrackable.images.length < 5 ? storeTrackable.images.length : 5
)


function __move(lIndex, rIndex, index, nIndex) {
  let lRank = lIndex == null ? null : storeTrackable.images[lIndex].rank
  let rRank = rIndex == null ? null : storeTrackable.images[rIndex].rank
  let image_id = storeTrackable.images[index].id

  let newRank = generateKeyBetween(lRank, rRank)

  console.log(index, lRank, rRank, newRank)

  storeTrackable.images[index].rank = newRank
  activeIndex.value = nIndex;


  storeTrackable.updateImageRank(image_id, newRank );

  return newRank
}

function setImageFirst(index) {
  if (storeTrackable.images.length < 2 || index == 0) {
    return;
  }
  __move(null, 0, index, 0);
}

function setImageLast(index) {
  const lastIndex = storeTrackable.images.length-1
  if (storeTrackable.images.length < 2 || index == lastIndex ) {
    return;
  }
  __move(lastIndex, null, index, lastIndex);
}

function setImageNext(index) {
  const lastIndex = storeTrackable.images.length-1
  if (storeTrackable.images.length < 2 || index >= lastIndex ) {
    return;
  }
  __move(index+1, index+2<lastIndex? index+2 : null, index, index+1);
}

function setImagePrevious(index) {
  const lastIndex = storeTrackable.images.length-1
  if (storeTrackable.images.length < 2 || index == 0 ) {
    return;
  }
  __move(index-2<0?null:index-2, index-1, index, index-1);
}

const idOfTheFirstImage = computed(()=>{
  console.log(storeTrackable.images?.length)
  if (storeTrackable.images?.length) {
    return storeTrackable.images[0].id
  }
  return -1
})

const idOfTheLastImage = computed(()=>{
  console.log(storeTrackable.images?.length)
  if (storeTrackable.images?.length) {
    return storeTrackable.images[storeTrackable.images?.length-1].id
  }
  return -1
})


</script>

<template>
  <div class="mx-2 mb-2 mt-2">
    <Galleria
      :value="storeTrackable.images"
      :responsiveOptions="responsiveOptions"
      :numVisible="visible"
      :circular="true"
      :showItemNavigators="true"
      :showThumbnails="true"
      xcontainerStyle="max-width: 640px"
      class="w-full"
      :reorderable="false"
      v-model:activeIndex="activeIndex"
      :key="storeTrackable.images.length"
    >
      <template #item="slotProps">
        <div style="position: relative" class="p-4">
          <img
            class="gallery-image"
            :src="imageUrl(slotProps?.item.filename)"
          />
          <span class="pi pi-star-fill primary-image-marker fill gallery" v-show="slotProps.item.id == idOfTheFirstImage"/>
          <span class="pi pi-star primary-image-marker outline gallery" v-show="slotProps.item.id == idOfTheFirstImage"/>
        </div>



        <div class="gallery-controls-left">
          <div class="p-2" style="background: darkgray; color: white; border-radius: 4px;">
            <i class="pi pi-image mr-1"/> {{ activeIndex+1 }} von {{ storeTrackable.images.length }}
          </div>
        </div>

        <div class="gallery-controls-right">
          <ButtonGroup>
            <Button @click="setImageFirst(activeIndex)" icon="pi pi-angle-double-left" size="small"
            :disabled="slotProps.item.id == idOfTheFirstImage" />
            <Button @click="setImagePrevious(activeIndex)" icon="pi pi-angle-left" size="small"
            :disabled="slotProps.item.id == idOfTheFirstImage"/>
            <Button @click="setImageFirst(activeIndex)" icon="pi pi-star-fill" size="small"
            :style="{ color: slotProps.item.id == idOfTheFirstImage ? '' : 'yellow' } "
            :disabled="slotProps.item.id == idOfTheFirstImage"/>
            <Button @click="setImageNext(activeIndex)" icon="pi pi-angle-right" size="small"
            :disabled="slotProps.item.id == idOfTheLastImage"/>
            <Button @click="setImageLast(activeIndex)" icon="pi pi-angle-double-right" size="small"
            :disabled="slotProps.item.id == idOfTheLastImage"/>
          </ButtonGroup>
          <Button @click="onRemoveImage" icon="pi pi-trash" label="Löschen" severity="danger" size="small"/>
        </div>
      </template>

      <template #thumbnail="slotProps">
        <div style="position: relative">
          <img
            class="thumbnail-image"
            :src="imageUrl(slotProps?.item.filename)"
          />
          <span class="pi pi-star-fill primary-image-marker thumbnail fill" v-show="slotProps.item.id == idOfTheFirstImage"/>
          <span class="pi pi-star primary-image-marker thumbnail outline" v-show="slotProps.item.id == idOfTheFirstImage"/>
        </div>
      </template>
    </Galleria>
  </div>
</template>

<style scoped>
.primary-image-marker {
  position: absolute;
}
.primary-image-marker.thumbnail {
  top: 0px;
  right: -15px;
  font-size: 14pt;
}
.primary-image-marker.gallery {
  top: 0px;
  right: -5px;
  font-size: 24pt;
}

.primary-image-marker.fill {
  color: yellow; top: 0;
}
.primary-image-marker.outline {
  color: #888
}

.image-stage.fill {
  max-width: 348px;
  max-height: 384px;          /* feste Höhe */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;       /* verhindert Layout-Sprünge */
}


/* Hauptbild */
.gallery-image {
  max-width: 100%;
  max-height: 384px;
  object-fit: contain;
  display: block
}

/* Thumbnail */
.thumbnail-image {
  width: 96px;
  object-fit: cover;
  display: block
}


.gallery-controls-right {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}
.gallery-controls-left {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}
</style>
