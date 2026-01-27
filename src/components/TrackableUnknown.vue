<script setup>
import { ref } from 'vue'
import Button from 'primevue/button';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
})

const searchfield = ref(props.name);

const onSearch = () => {
  window.location = "./"+searchfield.value;
}

</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center row-gap-0" style="height: 100%;">
    <div style="font-size: 24pt;">Trackable <b>{{props.name}}</b> is not in the database</div>
    <div style="text-align: center; font-size: 30vh;font-weight: 1000;">?</div>
    <div style="text-align: center; font-size: 16pt;">
      Do you want to add trackable <b>{{props.name}}</b> to our collection?
      <br/>
      <Button label="Add"/>
    </div>
    <div style="text-align: center; font-size: 16pt; width: 10cm;">
      <br/>
      Search for another trackable?
      <br/>
      <InputGroup>
          <InputText placeholder="Search for a trackable" v-model="searchfield" />
          <Button label="Search" @click="onSearch"/>
      </InputGroup>
    </div>
  </div>
</template>

<style scoped>
</style>
