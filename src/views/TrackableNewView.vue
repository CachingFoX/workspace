<script setup>
import { defineStore } from 'pinia'
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import BaseLayout from '@/components/layout/BaseLayout.vue'
import Navbar from '../components/Navbar.vue'
import TrackableNew from '../components/TrackableNew.vue'
import InputGroup from 'primevue/inputgroup';
import HLayout from '../components/layout/HLayout.vue'

const router = useRouter()
const route = useRoute()

const trackable_code = ref(null)
const data = ref(null);

const modelInput = ref(null);

const newTrackable = () => {
  router.push("/trackable/new/"+modelInput.value)
}

// we need this watch for this case if onMounted is not called: /trackable/new -> /trackable/new/XXXXXX
watch(() => route.params.id,
  (newState, oldState) => {
    trackable_code.value = newState ? newState.toUpperCase() : null;
  }
)

onMounted(async () => {
  trackable_code.value = route.params?.id ? route.params.id.toUpperCase() : null;
})
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:centerstage>
      <HLayout top="1" bottom="2">
        <TrackableNew v-if="trackable_code"
          :name="trackable_code"
        />
        <div v-else style="text-align: center;">
          <div class="font-bold text-2xl mb-2">Add a new trackable</div>
          <InputGroup>
            <InputText placeholder="Enter a trackable number" v-model="modelInput" @keydown.enter="newTrackable" />
            <Button icon="pi pi-plus" label="Add" @click="newTrackable"/>
          </InputGroup>
        </div>
      </HLayout>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
