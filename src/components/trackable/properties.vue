<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import PersistentPanel from '@/components/trackable/panel.vue'
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import PropertyEdit from '@/components/PropertyEdit.vue';
import PropertySeries from '@/components/trackable/details/property_series.vue'
import PropertyString from '@/components/trackable/details/property_string.vue'
import PropertyOwner from '@/components/trackable/details/property_owner.vue'
import PropertyCode from '@/components/trackable/details/property_code.vue'



const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();

function getProperty(property_name) {
  return storeTrackable.properties.find(prop => prop.property_name === property_name);
}
const filteredProperties = computed(() => {
  const excludedNames = ['linkedTrackables'];
  return storeTrackable.properties.filter(prop => !excludedNames.includes(prop.property_name));
});

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
</script>

<template>
  <PersistentPanel storage-key="trackable.details.properties" title="Eigenschaften" >
    <div class="grid-container">
      <template v-for="property in filteredProperties" :key="property.id">
        <div class="grid-item left" >{{ property.property_name }}</div>
        <div class="grid-item right">
          <PropertyString v-if="property.property_type == 'string'"
            :value="property.property_value"
            :property="property"
            editable removable
            placeholder="Click to edit"
            @update="onUpdate"
            @remove="onRemove"
            />
          <PropertyEdit v-else
            :trackable_property="property"
          />
         <!-- {{ property }} -->
        </div>
      </template>
    </div>
  </PersistentPanel>
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
