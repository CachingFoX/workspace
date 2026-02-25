<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
// prime vue
import Panel from 'primevue/panel'
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { useTrackableStore } from "@/di/trackables.js"
import { useConfirm } from "primevue/useconfirm";
// components
import PropertyString from '@/components/trackable/details/property_string.vue'
import PropertyText from '@/components/trackable/details/property_text.vue'
import Tags from '@/components/trackable/tags.vue'
import { useLocalStorageRef } from '@/utils/localStorageRef';


const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const storeTrackable = useTrackableStore();
const collapsed = useLocalStorageRef('details.layout.properties.collapsed', false)

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

const comp = {
  'string': { component: PropertyString },
  'string.uppercase': { component: PropertyString, bindings: { 'format': 'uppercase' } },
  'string.lowercase': { component: PropertyString, bindings: { 'format': 'lowercase' } },
  'text': { component: PropertyText },
}
</script>

<template>
  <Panel class="mx-2" v-model:collapsed="collapsed" header="Eigenschaften" toggleable>
    <div class="grid-container">
      <div class="grid-item left" >Schlagwörter</div>
      <div class="grid-item right"><Tags/></div>

      <template v-for="property in filteredProperties" :key="property.id">
        <div class="grid-item left" >{{ property.property_name }}</div>
        <div class="grid-item right">
          <component v-if="comp[property.property_type]" :is="comp[property.property_type].component"
            :value="property.property_value"
            :property="property"
            editable removable
            placeholder="Click to edit"
            v-bind="comp[property.property_type].bindings"
            @update="onUpdate"
            @remove="onRemove"
            />
          <div v-else style="padding: 6px 0;">
            {{ property.property_value }}<i class="ml-2" style="color: red">(Unknown type: {{ property.property_type }})</i>
          </div>
        </div>
      </template>
    </div>
  </Panel>
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
  align-self: top;
}

.grid-container > .grid-item.left {
  padding-top: 6px;
  font-weight: bold;
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
