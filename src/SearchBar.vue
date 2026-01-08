<script setup>
import './main.css'
import 'primeflex/primeflex.css';
import { defineProps, ref, watch, computed } from 'vue'
import { onBeforeUnmount } from 'vue'
import Badge from 'primevue/badge';
import Checkbox from 'primevue/checkbox';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import { useSearchFilterStore} from '@/stores/search'
import * as filter from '@/stores/search';
import { useFilteredDataStore } from '@/stores/filtereddata'
import { useDataStore } from '@/stores/data'
import * as fparameter from '@/stores/filterparameters'
import * as sparameter from '@/stores/sortparameters'
import { onBeforeMount, onMounted } from 'vue'
import Menubar from 'primevue/menubar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import NavbarIcon from './NavbarIcon.vue';

const store = useSearchFilterStore();
const storeData = useDataStore();
const storeFilteredData = useFilteredDataStore();
const storeFilterParameter = fparameter.useFilterParameterStore();
const storeSortParameter = sparameter.useSortParameterStore();

const props = defineProps({
  collections: {
    type: Object,
    required: true
  },
  owners: {
    type: Object,
    required: true
  },
  tags: {
    type: Object,
    required: true
  }
})

const options = ref([
  { "label": "Keine", "value": filter.KEY_CATEGORY_NONE, icon: 'pi pi-align-left'},
  { "label": "Sammlungen", "value": filter.KEY_CATEGORY_COLLECTION, icon: 'pi pi-book'},
  { "label": "Schlagwörter", "value": filter.KEY_CATEGORY_TAG, icon: 'pi pi-tag'},
  { "label": "Eigentümer", "value": filter.KEY_CATEGORY_OWNER, icon: 'pi pi-user'},
]);

const viewOptionsSorting = ref([
  { "label": "Alter", "value": filter.KEY_SORTING_ID, icon: 'pi pi-calendar'},
  { "label": "Name", "value": filter.KEY_SORTING_NAME, icon: 'pi pi-address-book'},
  { "label": "Origin Name", "value": filter.KEY_SORTING_ORIGIN_NAME, icon: 'pi pi-address-book'},
]);

const viewOptionsSortingOrderForName = ref([
  { "label": "Aufsteigend", "value": filter.KEY_SORT_ORDER_ASC, icon: 'pi pi-sort-alpha-down'},
  { "label": "Absteigend", "value": filter.KEY_SORT_ORDER_DESC, icon: 'pi pi-sort-alpha-down-alt'},
]);

const viewOptionsSortingOrderForId = ref([
  { "label": "Älteste", "value": filter.KEY_SORT_ORDER_ASC, icon: 'pi pi-sort-numeric-down'},
  { "label": "Neuste", "value": filter.KEY_SORT_ORDER_DESC, icon: 'pi pi-sort-numeric-down-alt'},
]);

const xoptions = ref([
  { "label": "Name", "value": false, "key": filter.VALUE_FIELD_NAME },
  { "label": "Original Name", "value": false, "key": filter.VALUE_FIELD_ORIGIN_NAME },
  { "label": "Stichwörter", "value": false, "key": filter.VALUE_FIELD_TAGS },
  { "label": "Sammlungen", "value": false, "key": filter.VALUE_FIELD_COLLECTIONS },
  { "label": "Notizen", "value": false, "key": filter.VALUE_FIELD_NOTES },
  { "label": "Tracking Number", "value": false, "key": filter.VALUE_FIELD_TRACKING_NUMBER },
]);

onBeforeMount(() => {
  for (let index in xoptions.value) {
    xoptions.value[index].value = (store.fields.includes(xoptions.value[index].key) || store.fields.length == 0);
  }
});

function noBreakSpaces(text) {
  return text.replace(" ", '\xa0');
}

const labelText = computed(() => {
  let s = [];
  for (let index in xoptions.value) {
    if (xoptions.value[index].value || store.fields.length == 0) {
      s.push(xoptions.value[index].label);
    }
  }
  return s.join(', ')
});

const toggleState = ref(false);

function checkBoxClicked() {
  let s = [];
  for (let index in xoptions.value) {
    if (xoptions.value[index].value) {
      s.push(xoptions.value[index].key)
    }
  }
  store.fields = s;
}
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const shortcutDisplay = computed(() => (isMac ? '⌘' : 'Ctrl'))

// Tastenkombination global
function handleShortcut(event) {
  const isShortcutPressed = (isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k'
  if (isShortcutPressed) {
    event.preventDefault()
    toggleState.value = !toggleState.value;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
})

function sort() {
  storeData.sort(store.viewOptSorting);
  storeFilteredData.doFilter();
}

</script>

<template>
  <Menubar :model="items" class="border-none shadow-none">
    <template #start>
      <NavbarIcon class="hidden sm:inline"/>
      <span class="ml-2 font-medium text-2xl">Our Trackables</span>
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
        <a v-ripple class="flex items-center" v-bind="props.action">
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
            <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
            <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <IconField :class="toggleState ? '' : 'md:inline'" class="hidden">
            <InputIcon class="pi pi-search" />
            <InputText v-model="storeFilterParameter.text" placeholder="Search" style="width: 400px;" />
            <InputIcon class="pi pi-spin pi-spinner" v-show="storeFilteredData.run"/>
            <div class="shortcut-badge-container" v-if="!storeFilteredData.run">
              <span class="shortcut-badge key shortcut-badge-key">{{ shortcutDisplay }}</span>
              <span class="shortcut-badge no-key shortcut-badge">+</span>
              <span class="shortcut-badge key shortcut-badge-key">K</span>
            </div>
        </IconField>
        <Button :class="toggleState ? '' : 'md:flex'" class="hidden"
          severity="contrast" variant="text"
          :icon="storeSortParameter.reverse ? 'pi pi pi-sort-alpha-down-alt' : 'pi pi pi-sort-alpha-up'"
          @click="storeSortParameter.reverse = !storeSortParameter.reverse"
          aria-label="Toggle"/>
        <Button icon="pi pi-bars" severity="contrast" variant="text"
          @click="toggleState = !toggleState"
          aria-label="Toggle"/>
      </div>
    </template>
  </Menubar>

  <div style="padding: 0.5rem; padding-top: 0.75rem; box-sizing: border-box; margin: auto;" v-show="toggleState">
    <div class="grid" >

      <div class="col-12">
        <div class="flex gap-3">
          <div style="flex: 1 1 auto;">
            <FloatLabel variant="on">
              <InputText id="on_label" type="text" v-model="storeFilterParameter.text" fluid/>
              <label for="on_label">{{ labelText }}</label>
            </FloatLabel>
          </div>
          <!--
          <div>
            <Button
              :icon="toggleState ? 'pi pi-sort-down-fill' : 'pi pi-sort-up-fill'"
              @click="toggleState = !toggleState"
              aria-label="Toggle"
            />

          </div>  -->
        </div>
      </div>

      <div class="col-12" style="padding-top: 0;" v-show="toggleState">
        <div class="flex flex-wrap">
          <div class="mr-2" v-for="(option, index) in xoptions" :key="option.key">
            <Checkbox :inputId="'chk'+index" class="mt-1" binary
              v-model="option.value"
              @change="checkBoxClicked()"
              />
            <label class="ml-1" :for="'chk'+index">{{ noBreakSpaces(option.label) }}</label>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6" v-show="toggleState">
        <FloatLabel class="w-full md:w-80" variant="on">
          <MultiSelect id="multiselect_collections" v-model="store.selectedCollections" display="chip"
            :options="props.collections" filter fluid showClear
            :maxSelectedLabels="3"  />
          <label for="multiselect_collections">
            Ist in {{ store.checkedAllCollections ? "allen Sammlungen" : "mindestens einer Sammlung" }} enthalten
          </label>
        </FloatLabel>
        <Checkbox class="mt-1" v-model="store.checkedAllCollections" binary /> Alle Sammlungen müssen zutreffen
      </div>
      <div class="col-12 md:col-6" v-show="toggleState">
        <FloatLabel class="w-full md:w-80" variant="on">
          <MultiSelect id="multiselect_tags" v-model="store.selectedTags" display="chip"
            :options="props.tags" filter fluid showClear
            :maxSelectedLabels="3"  />
          <label for="multiselect_Tags">Schlagwörter</label>
        </FloatLabel>
        <Checkbox class="mt-1" v-model="store.checkedAllTags" binary /> Alle Schlagwörter müssen zutreffen
      </div>

      <div class="col-12 md:col-6" v-show="toggleState">
        <FloatLabel class="w-full md:w-56" variant="on">
            <Select v-model="store.selectedOwner" inputId="select_owner" :options="props.owners" showClear class="w-full" />
            <label for="select_owner">Eigentümer</label>
        </FloatLabel>
      </div>
      <div class="col-12 md:col-6"></div>

      <div class="col-12 " v-show="toggleState">
        <label>Kategorien</label><br/>
        <SelectButton v-model="store.viewOptCategorize" :options="options"
        optionValue="value"
        optionLabel="label" dataKey="value" size="small" >
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>{{ slotProps.option.label }}
          </template>
        </SelectButton>
      </div>
      <div class="col-12" v-show="toggleState">
        <label>Sortierung</label><br/>
        <SelectButton
          v-model="store.viewOptSorting"
          :options="viewOptionsSorting"
          optionLabel="label"
          optionValue="value"
          dataKey="value"
           size="small">
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>{{ slotProps.option.label }}
          </template>
        </SelectButton>

        <SelectButton class="ml-4"
          v-model="storeSortParameter.reverse"
          :options="store.viewOptSorting == filter.KEY_SORTING_ID ?
          viewOptionsSortingOrderForId : viewOptionsSortingOrderForName"
          optionLabel="label"
          optionValue="value"
          dataKey="value"
           size="small" >
          <template #option="slotProps">
            <i :class="slotProps.option.icon"></i>{{ slotProps.option.label }}
          </template>
        </SelectButton>

      </div>
    </div>
  </div>

</template>

<style scoped>
/* Blendet den Button im Hochformat aus */
.querformat-only {
  display: none;
}

/* Blendet den Button im Querformat aus */
.hochformat-only {
  display: none;
}

/* Zeigt den Button nur im Querformat an */
@media (orientation: landscape) {
  .querformat-only {
    display: block; /* Oder block, flex, etc., je nach Bedarf */
  }
}

/* Zeigt den Button nur im Hochformat an */
@media (orientation: portrait) {
  .hochformat-only {
    display: block;
  }
}

.shortcut-badge-container {
  position: absolute;
  right: 0.5rem; /* Abstand zum rechten Rand */
  top: 45%;
  transform: translateY(-50%);
}

.shortcut-badge {
  color: #333;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
  font-family: monospace;
  user-select: none;
  pointer-events: none;
  background-color: #ffffff;
}

.shortcut-badge.no-key{
  padding: 2px 3px;
}

.shortcut-badge.key {
  border-radius: 4px;
  border: 1px solid #ccc;
  box-shadow: 2px 1px 4px rgba(0,0,0,0.1);
}

</style>
