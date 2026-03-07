<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router';

import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Menubar from 'primevue/menubar';
import NavbarIcon from '@/components/common/NavbarIcon.vue'
import NavbarFakeSearchField from '@/components/common/NavbarFakeSearchField.vue';
import AdvancedSearchDialog from './AdvancedSearchDialog/AdvancedSearchDialog.vue';

import { useBaseStore } from '@/stores/base.js'
import { API_ENVIRONMENT, getApiEnvironment } from "@/config/apiConfig"

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
    visibleAdvancedSearchDialog.value = true;
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
    }
]);

const visibleAdvancedSearchDialog = ref(false);

const isProductive = computed(()=>{
  return getApiEnvironment() == API_ENVIRONMENT.PRODUCTIVE
})
</script>

<template>
  <AdvancedSearchDialog v-model:visible="visibleAdvancedSearchDialog"/>
  <div class="navbar-container">
    <Menubar :model="items" class="border-none border-noround shadow-none"
       :class="{ 'is-not-productive' : !isProductive }" >
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
            <NavbarFakeSearchField @activate="visibleAdvancedSearchDialog = true"/>
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
.is-not-productive {
  background-color: crimson;
}

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
