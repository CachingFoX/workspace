<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Panel from 'primevue/panel'
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import PropertyBoolean from '@/components/trackable/details/property_boolean.vue'
import PropertyString from '@/components/trackable/details/property_simple.vue'
import PropertyText from '@/components/trackable/details/property_text.vue'
import PropertyTrackables from '@/components/trackable/details/property_trackables.vue'
import Tags from '@/components/trackable/tags.vue'
import { useLocalStorageRef } from '@/utils/localStorageRef';
import {makeRouteButton, makeLinkButton, formatDateTime} from '@/components/trackable/details/property_helper'

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const collapsed = useLocalStorageRef('details.layout.properties.collapsed', false)

function getProperty(property_name) {
  return storeTrackable.properties.find(prop => prop.property_name === property_name);
}

function onUpdate(property, newValue) {
  console.log("onUpdate", property, newValue)

  if (property.id) {
    storeTrackable.updateProperty(property.id, newValue);
  } else {
    storeTrackable.attachProperty(property.property_id, newValue);
  }
}

function onRemove(property) {
  storeTrackable.deleteProperty(property.id);
}

function onLink(i) {
  if (i?.property_value?.length) {
    window.open(i.property_value, "_blank" );
  }
}

const comp = {
  'boolean':          { component: PropertyBoolean, bindings: { labelFalse: 'nein', labelTrue: 'ja' }},
  'geocaches':        { component: PropertyString },
  'string':           { component: PropertyString },
  'string.hyperlink': { component: PropertyString, bindings: { 'hyperlink': true } },
  'string.lowercase': { component: PropertyString, bindings: { 'format': 'lowercase' } },
  'string.uppercase': { component: PropertyString, bindings: { 'format': 'uppercase' } },
  'text':             { component: PropertyText, fullline: true },
  'trackingnumbers':  { component: PropertyTrackables, fullline: true },
}

function getPlaceholderText(propertyName) {
  const placeholders = {
    'SSOCA Link': 'Click here to set a link to https://wiki.ssoca.eu'
  }
  return placeholders[propertyName] ?? "Click to edit";
}
</script>

<template>
  <!--
  <div class="sm:block hidden">sm</div>
  <div class="md:block hidden">md</div>
  <div class="lg:block hidden">lg</div>
  <div class="xl:block hidden">xl</div>
  -->

  <Panel class="mx-2" v-model:collapsed="collapsed" header="Eigenschaften" toggleable>
    <div class="grid-container sm:grid-container md:grid-container lg:grid-container xl:grid-container">

      <template v-for="property in storeTrackable.properties" :key="property.id">
        <div class="grid-item bold" v-if="!(comp[property.property_type]?.fullline)" >{{ property.property_name }}</div>
        <div class="grid-item" :class="comp[property.property_type]?.fullline ? 'full' : ''">
          <div v-if="comp[property.property_type]?.fullline" class="mt-1 mb-1" style="font-weight: bold;">{{ property.property_name }}</div>
          <component v-if="comp[property.property_type]" :is="comp[property.property_type].component"
            :value="property.property_value"
            :property="property"
            editable removable
            :placeholder="getPlaceholderText(property.property_name)"
            clipboard
            v-bind="comp[property.property_type].bindings"
            @update="onUpdate"
            @remove="onRemove"
            />
          <div v-else style="padding: 6px 0;">
            {{ property.property_value }}<i class="ml-2" style="color: red">(Unknown type: {{ property.property_type }})</i>
          </div>
        </div>
      </template>

      <div class="grid-item full mt-2">
        <div class="mt-2 mb-1" style="font-weight: bold;">Schlagwörter</div>
        <Tags class="w-full"/>
      </div>
    </div>
  </Panel>
</template>

<style scoped>
:deep(.p-panel-title) {
  font-size: 18pt;
}

.title {
  margin:0;
  font-size: 26pt;
  font-weight: bold;
}

/* Container für das Grid */
.grid-container {
  display: grid; /* Grid aktivieren */
  grid-template-columns: auto;
  grid-gap: 3px; /* Abstand zwischen den Elementen */
  column-gap: 10px;
  padding: 0;
}

/* sm */
@media screen and (min-width: 576px) {
  .sm\:grid-container {
    grid-template-columns: auto 1fr;
  }
  .sm\:grid-container > .grid-item.full {
    grid-column: 1 / span 2;
    grid-column-start: 1;
  }
}

/* md */
@media screen and (min-width: 768px) {
  .md\:grid-container {
    grid-template-columns: auto 1fr;
  }
  .md\:grid-container > .grid-item.full {
    grid-column: 1 / span 2;
    grid-column-start: 1;
  }
}

/* lg */
@media screen and (min-width: 992px) {
  .lg\:grid-container {
    grid-template-columns: auto 1fr auto 1fr;
  }
  .lg\:grid-container > .grid-item.full {
    grid-column: 1 / span 4;
    grid-column-start: 1;
  }
}

/* xl */
@media screen and (min-width: 1200px) {
  .xl\:grid-container {
    grid-template-columns: auto 1fr auto 1fr;
  }
  .xl\:grid-container > .grid-item.full {
    grid-column: 1 / span 4;
    grid-column-start: 1;
  }
}



/* Grid-Items */
.grid-container > div {
  padding: 0 12px0px;
  text-align: left;
  align-self: top;
}

.grid-container > .grid-item.bold {
  padding-top: 6px;
  font-weight: bold;
}

.grid-container > .grid-item.full {
  grid-column-start: 1;
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

</style>
