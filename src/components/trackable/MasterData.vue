<script setup>
import { ref } from 'vue'
// prime vue
import { useTrackableStore } from "@/di/trackables.js"
// components
import PropertyString from '@/components/trackable/details/property_simple.vue'
import { geocachingService } from "@/di/trackables.js"
import {makeRouteButton, makeLinkButton, formatDateTime} from '@/components/trackable/details/property_helper'

const storeTrackable = useTrackableStore();

const items = [
  { name: 'Name',
    component: PropertyString,
    bindings: {
      value: storeTrackable.name
    }
  },
  { name: 'Serie',
    component: PropertyString, bindings: {
      value: storeTrackable.series,
      buttons: [
        makeRouteButton(true, "/series/"+storeTrackable.series,'pi-tags',/*'Alle Trackables'*/),
      ]
    }
  },
  { name: 'Trackable Code',
    component: PropertyString,
    bindings: {
      value: storeTrackable.private_code,
      buttons: [
        makeLinkButton(true, geocachingService.getLinkGeocachingTrackable(storeTrackable.private_code),'pi-globe',
        /*'Trackable auf www.geocaching.com öffnen'*/),
      ]
    }
  },
  { name: 'Public Code',
    component: PropertyString,
    bindings: {
      value: storeTrackable.public_code,
      buttons: [
        makeLinkButton(true, geocachingService.getLinkGeocachingTrackable(storeTrackable.public_code),'pi-globe',
        /*'Trackable auf www.geocaching.com öffnen'*/),
      ]
    }
  },
  { name: 'Id',
    component: PropertyString,
    bindings: {
      value: storeTrackable.hq_trackable_id,
      buttons: [
        makeLinkButton(true, geocachingService.getLinkGeocachingTrackableById(storeTrackable.hq_trackable_id),'pi-globe',
        /*'Trackable auf www.geocaching.com öffnen'*/),
      ]
    }
  },
  { name: 'Owner',
    component: PropertyString,
    bindings: {
      icon: storeTrackable.activated ? 'pi pi-user' : 'pi pi-times',
      value: storeTrackable.activated ? storeTrackable.owner : 'not activated',
      buttons: [
        makeRouteButton(storeTrackable.activated, "/owner/"+storeTrackable.owner,'pi-tags',/*'Alle Trackables'*/),
        makeLinkButton(storeTrackable.activated, geocachingService.getLinkGeocachingUserProfile(storeTrackable.owner),'pi-globe',
        /*'Profil auf www.geocaching.com öffnen'*/),
      ],
      clipboard: storeTrackable.activated
    }
  },
  { name: 'Created',
    component: PropertyString,
    bindings: {
      value: formatDateTime(storeTrackable.created),
    }
  },
  { name: 'Updated',
    component: PropertyString,
    bindings: {
      value: formatDateTime(storeTrackable.updated),
    }
  },
];
</script>

<template>
  <div class="flex align-items-stretch gap-2 mx-2">
    <div class="flex-grow-1 panel p-3">
        <div class="grid-container">
          <template v-for="(item, index) in items" :key="index" >
            <div v-if="item.name" class="no-wrap">{{item.name}}</div>
            <div v-else></div>
            <div v-if="item.name">
              <component
                :is="item.component"
                clipboard
                v-bind="item.bindings">
              </component>
            </div>
            <div v-else></div>
          </template>
        </div>
    </div>
    <div class="flex-shrink-0 flex-shrink-0 panel" >
      <div class="flex align-items-center h-full">
        <img v-if="storeTrackable.images.length"
          class="gallery-image mx-8" style="max-width: 250px; max-height: 250px"
          :src="`http://localhost:8000/images/${storeTrackable.images[0].filename}`"
        />
        <i class="pi pi-image mx-8" style="font-size: 196px; color: lightgrey"  v-else/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: block;
  border: 1px solid var(--p-panel-border-color);
  border-radius: var(--p-panel-border-radius);
  background: var(--p-panel-background);
  color: var(--p-panel-color);
}

.title {
  margin:0;
  font-size: 26pt;
  font-weight: bold;
}

/* Container für das Grid */
.grid-container {
  display: grid; /* Grid aktivieren */
  grid-template-columns: auto 1fr; /* auto 2fr auto 1fr; */
  grid-gap: 2px; /* Abstand zwischen den Elementen */
  column-gap: 10px;
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
  border-radius: 10px;
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
