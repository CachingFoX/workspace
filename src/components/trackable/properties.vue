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
const icons = ref([]);

function onEdit(e) {
  console.log("onEdit", e);
}
function onRemove(e) {
  console.log("onRemove", e);
}
</script>

<template>
  <PersistentPanel storage-key="trackable.details.properties" title="Eigenschaften" :icons2="icons">
    <div class="grid-container">
      <template v-for="property in filteredProperties" :key="property.id">
        <div class="grid-item left" >{{ property.property_name }}</div>
        <div class="grid-item right">
          <PropertyString v-if="false && property.property_type == 'string'"
            :value="property.property_value"
            :data="property"
            :editable="onEdit"
            :removable="onRemove"
            placeholder="Click to edit"
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
