<script setup>
import { computed,ref, watch, onBeforeMount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
// PrimeVue import
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputText from 'primevue/inputtext';
// Components
import BaseLayout from '@/components/layout/BaseLayout.vue';
import Navbar from '@/components/common/Navbar.vue';


const router = useRouter();
const route = useRoute()

const tracking_code = ref(null);
const modelSearch = ref('');

const goToTrackable = () => {
  router.push("/trackable/"+modelSearch.value)
}

const newTrackable = () => {
  router.push("/trackable/new/"+tracking_code.value)
}

onMounted(async () => {
  tracking_code.value = route.params.id.toUpperCase();
})
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Navbar/>
    </template>
    <template v-slot:centerstage>
      <div class="flex flex-column align-items-center justify-content-center row-gap-0 h-full">
        <div style="font-size: 24pt;">Trackable <b>{{tracking_code}}</b> is not in the database</div>
        <div style="text-align: center; font-size: 30vh;font-weight: 1000;">?</div>
        <div style="text-align: center; font-size: 16pt;">
          Do you want to add trackable <b>{{tracking_code}}</b> to our collection?
          <br/>
          <Button label="Add" @click="newTrackable"/>
        </div>
        <div style="text-align: center; font-size: 16pt; width: 10cm;">
          <br/>
          Search for another trackable?
          <br/>
          <InputGroup>
              <InputText placeholder="Enter a trackable number" v-model="modelSearch" @change="goToTrackable" />
              <Button label="Go" @click="goToTrackable"/>
          </InputGroup>
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<style scoped>
</style>
