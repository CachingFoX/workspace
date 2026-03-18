<script setup>
import { computed, ref, watch, onBeforeMount } from 'vue'
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Panel from '@/components/common/panel.vue'
import CloudChip from '@/components/dashboard/CloudChip.vue'
import { useSafeModel, defineGetterSetter } from '@/components/dashboard/interface.js'

const emit = defineEmits('select')

/* --- Dashboard widget interface --- */
const localConfiguration = ref({});
const modelConfiguration = defineModel('configuration');
const configuration = useSafeModel(modelConfiguration, localConfiguration);
const collapsed = defineGetterSetter(configuration, "collapsed", false)
const max = defineGetterSetter(configuration, "max", 10)
const more = defineGetterSetter(configuration, "more", false)
const sort = defineGetterSetter(configuration, "sort", 'count_down')
/* Note: do not use configuration.collapse directly
  nur über computed getter/setter auf configuration members zugreifen, ansonsten gibt es probleme beim speichern */
/* --------------------------------- */

const sort_functions = {
  'text_up': (items) => {
            if (!props.labelText?.length) {
              return true;
            }
            items.sort( (a,b) => {
              let _a = text(a)
              let _b = text(b)
              return _a.localeCompare(_b)
            } )
          },
  'text_down': (items) => {
            if (!props.labelText?.length) {
              return true;
            }
            items.sort( (a,b) => {
              let _a = text(a)
              let _b = text(b)
              return _b.localeCompare(_a)
            })
          },
  'count_up': (items) => {
            if (!props.labelCount?.length) {
              return true;
            }
            items.sort( (a,b) => {
              let _a = count(a)
              let _b = count(b)
              return _a > _b
            })
          },
  'count_down': (items) => {
            if (!props.labelCount?.length) {
              return true;
            }
            items.sort( (a,b) => {
              let _a = count(a)
              let _b = count(b)
              return _a < _b
            })
          },
}

function setSort(selectedItem) {
  sort.value = selectedItem.value;
}

function updateMenu(newValue) {
  basic_menu_items.value.forEach(item => {
    if (item.group == 'sorting') {
      item.checked = item.value ? (item.value === newValue) : false;
    }
  })
}

watch(sort, (newValue) => {
  updateMenu(newValue)
})

const basic_menu_items = ref([
  { label: 'Name A-Z', icon: 'pi pi-sort-alpha-down',
    value: 'text_up', group: 'sorting',
    command: (e) => { setSort(e.item) },
  },
  { label: 'Name Z-A', icon: 'pi pi-sort-alpha-down-alt',
    value: 'text_down', group: 'sorting',
    command: (e) => { setSort(e.item) },
  },
  { label: 'Häufig',  icon: 'pi pi-sort-numeric-down-alt',
    value: 'count_down', group: 'sorting',
    command: (e) => { setSort(e.item) },
  },
  { label: 'Selten', icon: 'pi pi-sort-numeric-down',
    value: 'count_up', group: 'sorting',
    command: (e) => { setSort(e.item) },
  },
]);

const sorted_items = computed(() => {
  if (sort.value in sort_functions) {
    sort_functions[sort.value](props.items);
  }
  return props.items;
});

function onClick(e) {
  if (props.clickable) {
    emit('select', e)
  }
}

const props = defineProps({
  title: { type: String, required: true, default: '<No Title>' },
  titleIcon: { type: String, required: false, default: '' },
  titleCount: { type: Boolean, default: false, required: false },

  items: { type: Object, required: true, default: null },
  ready: { type: Boolean, required: false, default: false },
  menu: { type: Object, required: false, default: null },
  clickable: { type: Boolean, default: false, required: false },

  /* ---------------- */
  labelAvatar: { type: String, default: null, required: true },
  labelCount: { type: String, default: null, required: true },
  labelIcon: { type: String, default: null, required: true },
  labelImage: { type: String, default: null, required: true },
  labelText: { type: String, default: null, required: true },
  defaultAvatar: { type: String, default: null, required: false },
  defaultIcon: { type: String, default: null, required: false },
  defaultImage: { type: String, default: null, required: false },
  defaultText: { type: String, default: null, required: false },
});

const menuItems = computed(()=>{
  if (props.menu?.length) {
    let z = basic_menu_items.value.concat([{
      separator: true
    }]);
    return z.concat(props.menu)
  }
  return basic_menu_items.value
})

const titleCount = computed(()=>{
  return props.titleCount ? props.items.length : null
})

onBeforeMount(()=>{
  updateMenu(sort.value);
})

const avatar = (item) => {
  let avatar = item[props.labelAvatar]
  return avatar ?? ( props.defaultAvatar ?? null )
}
const count = (item) => {
  let count = item[props.labelCount]
  return count ?? null
}
const icon = (item) => {
  let icon = item[props.labelIcon]
  return icon ?? ( props.defaultIcon ?? null )
}
const image = (item) => {
  let image = item[props.labelImage]
  return image ?? ( props.defaultImage ?? null )
}
const text = (item) => {
  let text = item[props.labelText]
  return text ?? ( props.defaultText ?? null )
}


</script>

<template>
  <Panel
    :title="props.title"
    :title-icon="props.titleIcon"
    :badge="titleCount"
    :menu="menuItems"
    v-model:collapsed="collapsed"
    >

    <div v-if="!props.ready" class="flex w-full justify-content-center">
      <ProgressSpinner/>
    </div>

    <div v-else class="flex flex-wrap gap-2 px-2 pb-2">
      <CloudChip v-for="(item, index) in sorted_items" :key="index"
        v-show="(index < max || more)"
        class="mr-1"
        :item="item"
        :avatar="avatar(item)"
        :icon="icon(item)"
        :image="image(item)"
        :text="text(item)"
        :count="count(item)"
        :clickable
        @click="onClick"
      />
    </div>

    <div>
      <Button
        :label="more ? 'Weniger Anzeigen' : 'Mehr Anzeigen'"
        :icon="more ? 'pi pi-minus' : 'pi pi-plus'"
        severity="secondary" class="mt-2" size="small"
        v-show="props.items.length > max"
        @click="more = !more"
      ></Button>
    </div>

  </Panel>
</template>
