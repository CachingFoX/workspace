<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router';

import 'primeflex/primeflex.css';
import Badge from 'primevue/badge';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import NavbarIcon from './NavbarIcon.vue';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import { useBaseStore } from '../stores/base.js'

const storeBase = useBaseStore();

const router = useRouter();

const props = defineProps({
  blank: {
    type: Boolean,
    required: false
  },
});

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const shortcutDisplay = computed(() => (isMac ? '⌘' : 'Ctrl'))

const searchModel = ref('');
const searchInput = ref(null);
const isFocused = ref(false);

// Tastenkombination global
async function handleShortcut(event) {
  const isShortcutPressed = (isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k'
  if (isShortcutPressed) {
    event.preventDefault()
    setFocusSearchInputField()
  }
}

async function setFocusSearchInputField() {
    await nextTick()
    const inputEl = searchInput.value.$el.querySelector('input')
    searchInput.value.$el.focus();
}

function logout() {
  router.push("/login")
}

function goToTrackable(e) {
  console.log(e.target.value)
  router.push("/trackable/"+e.target.value)
}

function onNewTrackable() {
  router.push("/trackable/new");
}

onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleShortcut)
})

const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: '/dashboard'
    },
    {
        label: 'All Trackables',
        icon: 'pi pi-list',
        route: '/trackables'
    },
    {
        label: 'All Series',
        icon: 'pi pi-list',
        route: '/trackables'
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

</script>

<template>
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
          <IconField  >
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchModel"
                placeholder="Search"
                ref="searchInput"
                class="search-input"
                :class="{ 'focused': isFocused }"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @keydown.enter="goToTrackable"
              />
              <!-- <InputIcon class="pi pi-spin pi-spinner" v-show="storeFilteredData.run"/> -->
              <div class="shortcut-badge-container">
                <span class="shortcut-badge key shortcut-badge-key">{{ shortcutDisplay }}</span>
                <span class="shortcut-badge no-key shortcut-badge">+</span>
                <span class="shortcut-badge key shortcut-badge-key">K</span>
              </div>
          </IconField>

          <Button label="New Trackable" icon="pi pi-plus" @click="onNewTrackable"/>
          <Button label="Logout" as="router-link" to="/logout"/>
          <Avatar :label="storeBase.username1stLetter" class="ml-2 mr-2" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
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

.search-input {
  width: 200px;
}
.p-inputtext.focused {
  width: 300px;
}
</style>
