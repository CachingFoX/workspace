
<script setup>
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import { defineProps } from 'vue'
import Chip from 'primevue/chip';
import DataView from 'primevue/dataview';
import Tag from 'primevue/tag';
import TrackableImage from './TrackableImage.vue';


const props = defineProps({
  items: {
    type: Object,
    required: true
  }
})

function trackUrl(code, activateCode) {
  if (activateCode) {
    return `https://www.geocaching.com/track/Activate.aspx?trknum=${code}&activationCode=${activateCode}`;
  } else {
    return `https://www.geocaching.com/track/details.aspx?tracker=${code}`;
  }
}

function $BROWSER(event) {
  event.preventDefault();
  const url = `https://www.geocaching.com/p/default.aspx?u=${event.target.innerText}`;
  console.log("Opening URL in browser:", url);
  window.open(url, '_blank');
}

</script>

<template>
  <DataView :value="props.items" layout="list">
    <template #list="slotProps">
<!--
       <div class="grid grid-cols-12 gap-4">
            <div v-for="(item, index) in slotProps.items" :key="item.id" class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2">
                <div class="p-6 border-1 border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                    <div class="bg-surface-50 flex justify-center rounded p-4">
                        <div class="relative mx-auto">
                            <TrackableImage :src="item.mainPicture ? `${ item.mainPicture }` : ''" altImage="no-picture.bmp"/>
                            <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px">
                                <Tag :value="123" ></Tag>
                            </div>
                        </div>
                    </div>
                    <div class="pt-6">
                        <div class="flex flex-row justify-between items-start gap-2">
                            <div>
                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">{{ item.category }}</span>
                                <div class="text-lg font-medium mt-1">{{ item.name }}</div>
                            </div>
                            <div class="bg-surface-100 p-1" style="border-radius: 30px">
                                <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                    <span class="text-surface-900 font-medium text-sm">{{ item.rating }}</span>
                                    <i class="pi pi-star-fill text-yellow-500"></i>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-6 mt-6">
                            <span class="text-2xl font-semibold">${{ item.price }}</span>
                            <div class="flex gap-2">
                                <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto whitespace-nowrap"></Button>
                                <Button icon="pi pi-heart" variant="outlined"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      -->

      <div class="flex-column gap-1 hidden sm:flex">
        <div v-for="(item, index) in slotProps.items" :key="item.id">
          <div class="flex flex-row sm:flex-row sm:items-center p-3 gap-3"
            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
            <div class="md:w-40 relative">
              <TrackableImage :src="item.mainPicture ? `${ item.mainPicture }` : ''" altImage="no-picture.bmp"/>
            </div>
            <div class="flex flex-column justify-between items-start gap-0">
              <div class="flex gap-1">
                <div style="padding: 2px;"><img style="width: 36px;" :src="`${item.iconURL}`" :alt="item.name" /></div>
                <div>
                  <div class="font-bold">{{ item.name }}</div>
                  <div><span class="font-medium text-surface-000 dark:text-surface-000 text-sm">{{ item.originName }}</span></div>
                </div>
              </div>
              <div class="mt-1 font-medium text-surface-000 h-full">{{ item.note }}</div>
              <div class="">
                <Tag v-for="col, idx in item.collections" :key="col"
                  class="mr-1 mb-1 small unselectable clickable" icon="pi pi-book"
                  xseverity="secondary" :value="col"
                  @click.prevent="$emit('selectCollection', col)"/>
                <Tag v-for="tag, idx in item.tags" :key="tag"
                  class="mr-1 mb-1 small unselectable clickable" icon="pi pi-tag"
                  severity="info" :value="tag"
                  @click.prevent="$emit('selectTag', tag)"/>
              </div>
            </div>
            <div class="flex flex-column md:flex-row justify-between md:items-center flex-1 gap-6">
              <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                <div>
                </div>
              </div>
            </div>
            <div class="flex flex-column justify-between items-start gap-0">
              <div class="flex align-items-end justify-content-end" v-if="item.privateCode">
                <span class="mr-1">{{ item.activateCode ? "🔑" : "🔒"}}</span>
                <a class="link-tracking-code"
                  :href="trackUrl(item.privateCode, item.activateCode)">{{ item.privateCode }}</a>
              </div>
              <div v-if="item.publicCode" class="flex mt-1 align-items-end justify-content-end">
                <span class="mr-1">🌍</span>
                <a class="link-tracking-code" :href="trackUrl(item.publicCode)">{{ item.publicCode }}</a>
              </div>
              <div class="h-full"></div>
              <div class="">
                <Chip v-if="item.owner2 && item.owner == ''" class="pi pi-user mt-3 unselectable" :label="item.owner2"/>

                <Chip v-if="item.owner" class="pi pi-user mt-3 unselectable clickable" :label="item.owner"
                  @click="$BROWSER($event)"/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DataView>
</template>

<style scoped>
.text-surface-000 {
  color: #aaa;
}
.link-tracking-code {
  text-decoration: none;
  color: inherit;
  font-family: monospace;
}
.border-t {
  border-top: 1px solid #eee;
}
.unselectable {
  user-select: none;          /* Standard */
  -webkit-user-select: none;  /* Für Safari/ältere Chrome-Versionen */
  -moz-user-select: none;     /* Für Firefox */
  -ms-user-select: none;      /* Für alte IE-Versionen */
}
.clickable {
  cursor: pointer;
}
.card {
    background: var(--card-bg);
    border: var(--card-border);
    padding: 2rem;
    border-radius: 10px;
    margin-bottom: 1rem;
}

</style>
