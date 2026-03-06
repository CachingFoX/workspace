<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';

import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Menubar from 'primevue/menubar';
import NavbarIcon from '@/components/common/NavbarIcon.vue'

import IconField from 'primevue/iconfield';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

import { useBaseStore } from '@/stores/base.js'
import { useTrackableStore, useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import { seriesService } from "@/di/trackables.js"

import AdvancedSearchBar from '@/components/common/AdvancedSearchBar/AdvancedSearchBar.vue';
import ShortcutBadge from '@/components/common/ShortcutBadge.vue';


const storeBase = useBaseStore();

const router = useRouter();

const props = defineProps({
  blank: {
    type: Boolean,
    required: false
  },
});

function onShortcut(event) {
  if (event == 'META_k_') {
    visibleSearchBar.value = true;
  }
}

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/dashboard'
    },
    {
        label: 'Trackables',
        icon: 'pi pi-list',
        route: '/trackables'
    },
    {
        label: 'Series',
        icon: 'pi pi-list',
        route: '/trackables'
    },
    {
        label: 'Tags',
        icon: 'pi pi-tags',
        route: '/tags'
    },
  /*
    {
        label: 'Projects',
        icon: 'pi pi-search',
        badge: 3,
        items: [
            {
                label: 'Core',
                icon: 'pi pi-bolt',
                shortcut: '⌘+S'
            },
            {
                label: 'Blocks',
                icon: 'pi pi-server',
                shortcut: '⌘+B'
            },
            {
                separator: true
            },
            {
                label: 'UI Kit',
                icon: 'pi pi-pencil',
                shortcut: '⌘+U'
            }
        ]
    }
        */
]);

const storeTrackables = useTrackableListStore();
const storeTags = useTagsStore();
const series = ref(null)
const visibleSearchBar = ref(false);

onMounted(() => {
  seriesService.get_all_series().then((e)=>{
    series.value = e;
  })
});
</script>

<template>
  <Dialog v-model:visible="visibleSearchBar" modal position="top" :style="{ width: '80%'}">
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
          <span class="font-bold whitespace-nowrap">Advanced Search</span>
      </div>
    </template>
    <div>
      <AdvancedSearchBar class="w-full"
        :trackables="storeTrackables.trackables"
        :series="series"
        :tags="storeTags.tags"
        placeholder="Search for trackables, tags and series or add a new trackable"
        @select="visibleSearchBar = false"
      />
    </div>
  </Dialog>
  <div class="navbar-container">
    <Menubar :model="items" class="border-none shadow-none">
      <template #start>
        <NavbarIcon class="hidden sm:inline"/>
        <span class="ml-2 font-medium text-2xl">Our Trackables</span>
      </template>

      <template v-if="!blank" #item="{ item, props, hasSubmenu, root }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
              <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                  <span :class="item.icon" />
                  <span>{{ item.label }}</span>
              </a>
          </router-link>

          <a v-else v-ripple class="flex items-center" v-bind="props.action">
              <span>{{ item.label }}</span>
              <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
              <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
              <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
          </a>
      </template>

      <template v-if="!blank" #end>
        <div class="flex align-items-center gap-2">
          <!-- fake search field -->
          <div>
            <InputGroup @click="visibleSearchBar = true">
              <InputGroupAddon>
                <i class="pi pi-search mr-2"></i>
                <span class="pr-7 no-select">Search</span>
                <div style="position: relative; top: -1px; right: -8px">
                  <ShortcutBadge
                    :shortcuts="[['META', 'k']]"
                    :listen="true"
                    @shortcut="onShortcut"
                  />
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div>
            <Avatar :label="storeBase.username1stLetter" class="ml-2 mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
          </div>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<style scoped>
.navbar-container {
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.p-button.p-component {
  text-decoration: none;
}

.p-inputgroup {
  border: 1px solid transparent;
  border-radius: 6px;
}
.p-inputgroup:hover {
  border-color: black;
  color: black;
}

</style>
