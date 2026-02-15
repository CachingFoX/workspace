<script setup>
import { computed, onMounted, ref } from 'vue'
import 'primeflex/primeflex.css';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import TrackableTag from '@/components/TrackableTag.vue';
import Panel from '@/components/common/panel.vue'
import { seriesService } from "@/di/trackables.js"
import CloudChip from '@/components/dashboard/CloudChip.vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['select']);

const max = ref(10);
const more = ref(false);
const sort = ref('count_down');

const sort_functions = {
  'text_up': (items) => {
            items.sort( (a,b) => {
              let _a = a[props.textLabel]
              let _b = b[props.textLabel]
              return _a.localeCompare(_b)
            } )
          },
  'text_down': (items) => {
            items.sort( (a,b) => {
              let _a = a[props.textLabel]
              let _b = b[props.textLabel]
              return _b.localeCompare(_a)
            } )
          },
  'count_up': (items) => {
            items.sort( (a,b) => {
              let _a = a[props.badgeLabel]
              let _b = b[props.badgeLabel]
              return _a > _b
            })
          },
  'count_down': (items) => {
            items.sort( (a,b) => {
              let _a = a[props.badgeLabel]
              let _b = b[props.badgeLabel]
              return _a < _b
            })
          },
}

const basic_menu_items = ref([
  { label: 'Name A-Z', icon: 'pi pi-sort-alpha-down',
    command: () => { sort.value = 'text_up' },
  },
  { label: 'Name Z-A', icon: 'pi pi-sort-alpha-down-alt',
    command: () => { sort.value = 'text_down' },
  },
  { label: 'Häufig',  icon: 'pi pi-sort-numeric-down-alt',
    command: () => { sort.value = 'count_down' },
  },
  { label: 'Selten', icon: 'pi pi-sort-numeric-down',
    command: () => { sort.value = 'count_up' },
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
  storageKey: { type: String, required: false, default: 'seriescloudwidget' },
  title: { type: String, required: true, default: '<No Title>' },
  titleIcon: { type: String, required: false, default: '' },
  items: { type: Object, required: true, default: null },
  ready: { type: Boolean, required: false, default: false },
  menu: { type: Object, required: true, default: null },

  textLabel: { type: String, default: 'name', required: false },
  badgeLabel: { type: String, default: 'count', required: true },
  imageLabel: { type: String, default: 'icon', required: true },
  icon: { type: String, default: null, required: false },
  clickable: { type: Boolean, default: false, required: false },
  emptyText: { type: String, default: "<no text>", required: false },
  emptyIcon: { type: String, default: null, required: false },
  badge: { type: Boolean, default: null, required: false }
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

const badge = computed(()=>{
  return props.badge == null ? null : props.items.length
})
</script>

<template>
  <Panel
    :title="props.title"
    :title-icon="props.titleIcon"
    :storage-key="`${props.storageKey}`"
    :badge="badge"
    :menu="menuItems">

    <div v-if="!props.ready" class="flex w-full justify-content-center">
      <ProgressSpinner/>
    </div>

    <div v-else class="flex flex-wrap gap-1">
      <CloudChip v-for="(item, index) in sorted_items" :key="index"
        v-show="(index < max || more)"
        class="mr-1"
        :item="item"
        :text-label="props.textLabel"
        :badge-label="props.badgeLabel"
        :image-label="props.imageLabel"
        :icon="props.icon"
        :empty-text="props.emptyText"
        :empty-icon="props.emptyIcon"
        :empty-image="props.emptyImage"
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
