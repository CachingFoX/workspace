<script setup>
import { useRoute } from 'vue-router';
import { computed,ref } from 'vue'
import { onBeforeMount, onMounted } from 'vue'
import InputText from 'primevue/inputtext';
import AppCheckbox from '../components/AppCheckbox.vue'
import Skeleton from 'primevue/skeleton';
import Button from 'primevue/button';
import Message from 'primevue/message';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Textarea from 'primevue/textarea';

const route = useRoute();
const private_code = route.params.id.toUpperCase();

const data = ref({})
let copyData = null;

const isLoading = ref(true)
const isImageLoaded = ref(false)
const error = ref(null)

/*
let data = ref(null);
const ok = ref(false);
const title = ref('');
*/
const pin = ref(null);

const error_message = ref("");
const status_code = ref(0);

onMounted(async () => {
  try {
    data.value = {};
    copyData = {};

    const response = await fetch(`http://localhost:8000/trackables/${private_code}`)
    const result = await response.json()

    status_code.value = response.status;
    if (response.status == 200 ) {
      data.value = result;
      copyData = { ...result };
    } else if (response.status == 404 ) {
      data.value = {};
      copyData = {};
    } else {
      data.value = {};
      copyData = {};
      console.error(response);
    }

  } catch (err) {
    console.error(err);
    error.value = err
  } finally {
    isLoading.value = false
  }
})

const checkTracking = async () => {
  isLoading.value = true

  try {
    const response = await fetch(
      `http://localhost:8000/extern/trackables/?trackingcode=${encodeURIComponent(private_code)}`
    )
    const result = await response.json()
    if (!data.value) {
      data.value = result
      return
    }
    Object.assign(data.value, result);
  } catch (err) {
    console.err(err);
    error.value = err
  } finally {
    isLoading.value = false
  }
}

function diffDeep(a, b) {
  const result = {}

  const keys = new Set([...Object.keys(a), ...Object.keys(b)])

  for (const key of keys) {
    const valA = a[key]
    const valB = b[key]

    if (
      typeof valA === 'object' &&
      typeof valB === 'object' &&
      valA !== null &&
      valB !== null
    ) {
      const diff = diffDeep(valA, valB)
      if (Object.keys(diff).length > 0) {
        result[key] = diff
      }
    } else if (valA !== valB) {
      result[key] = valA
    }
  }

  return result
}

const sendUpdate = async () => {
  let r = diffDeep(data.value, copyData);
  console.log(copyData);
  console.log(r)

  try {
    const response = await fetch(`http://localhost:8000/trackables/${private_code}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"  // Wir senden JSON
      },
      body: JSON.stringify(r)  // JS-Objekt in JSON umwandeln
    });
    const result = await response.json();

    data.value = result;
    copyData = { ...result };
  } catch (err) {
    console.error(err);
    error.value = err
  } finally {
    isLoading.value = false
  }
};


const description = computed({
  get() {
    return data.value?.description
  },
  set(value) {
    if (!data.value) return;
    data.value.description = value;
    console.log(data.value);
    // if (!form.value) return
    // if (!form.value.user) form.value.user = {}
    // form.value.user.name = value
  }
})

</script>

<template>
  <Message v-show="status_code == 404" severity="error">Trackable {{private_code}} nicht in der Datenbank gefunden.</Message>
  <div v-show="status_code != 404">
    <!-- HEADING -->
      <div class="flex flex-column justify-between items-start gap-0 content-center" >
        <div class="flex gap-1">
          <div style="padding: 2px;">
            <Skeleton v-show="isLoading || !isImageLoaded" shape="circle" size="36px" style="padding: 2px;"></Skeleton>
            <img v-show="!isLoading && isImageLoaded"
              style="width: 36px;" :src="`https://www.geocaching.com${data?.icon_url}`" :alt="data?.name"
              @load="isImageLoaded = true;"/>
          </div>
          <div style="flex: 1; align-self: center;">
            <Skeleton v-show="isLoading" height="44px"></Skeleton>
            <div v-show="!isLoading" class="font-bold"><h1>{{ data?.title }}</h1></div>
          </div>
        </div>
      </div>

      <hr class="mt-1 mb-2"/>

      <div class="grid-container">
        <div>Trackable Code</div>
        <div>
          <Skeleton v-show="isLoading"></Skeleton>
          <span v-show="!isLoading">{{data?.private_code}}</span>
        </div>

        <div>Public Code</div>
        <div>
          <Skeleton v-show="isLoading"></Skeleton>
          <span v-show="!isLoading">{{data?.public_code}}</span>
        </div>

        <div>Serie</div>
        <div>
          <Skeleton v-show="isLoading" height="1rem"></Skeleton>
          <span v-show="!isLoading">{{data?.series}}</span>
        </div>

        <div>Owner</div>
        <div>
          <Skeleton v-show="isLoading" height="1rem"></Skeleton>
          <span v-show="!isLoading">{{data?.activated ? data.owner : "not activated"}}</span>
        </div>

        <div>Activation Code</div>
        <div>
          <Skeleton v-show="!data || isLoading" height="1rem"></Skeleton>
          <IconField style="width: 50rem" v-if="data" v-show="!isLoading">
              <InputText style="width: 100%" v-model="data.activation_code" placeholder="Search" size="small" />
              <InputIcon class="pi pi-pencil"/>
          </IconField>
        </div>

        <div class="big">Description</div>
        <div>
          <Skeleton v-show="isLoading" style="height: 3rem;"></Skeleton>
          <Textarea  v-model="description" rows="5" cols="130" />
        </div>

        <!--
        <div>Pin</div>
        <div>
          <Skeleton v-show="isLoading" height="1rem"></Skeleton>
          <div v-if="!isLoading" class="flex flex-row gap-2">
            <div>
                <AppCheckbox v-model="pin"/>
            </div>
            <div>
              <div v-if="pin === undefined || pin === null">nicht gesetzt</div>
              <div v-if="pin === false">ohne PIN</div>
              <div v-if="pin === true">mit PIN</div>
            </div>
          </div>
        </div>
        -->
      </div>



    <div class="mt-5">
      <Button @click="checkTracking" label="Aktualisieren" class="mr-3"/>
      <Button @click="sendUpdate" label="Speichern"/>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin:0;
}
textarea {
  height: 12rem;
  width: 50rem;
}
.textarea {
  height: 12rem;
}

/* Container für das Grid */
.grid-container {
  display: grid; /* Grid aktivieren */
  grid-template-columns: auto 1fr; /* 3 Spalten gleicher Breite */
  grid-gap: 10px; /* Abstand zwischen den Elementen */
  padding: 0;
}

/* Grid-Items */
.grid-container > div {
  padding: 0 12px0px;
  text-align: left;
  align-self: center;
}

.grid-container > div:nth-child(odd) {
  font-weight: bold;
}

.grid-container > div.big {
  align-self: start;
}

/*
.p-inputtext {
  border: none;
  height: 31px;
  shadow: 0;
}

.p-iconfield {
  border: none;
  height: 31px;
}

.p-iconfield:hover .p-inputtext{
  border: 1px solid #000;
}
.p-iconfield:hover .p-inputicon  {
  display: block;
}
.p-inputtext:focus .p-inputtext{
  border: 1px solid #000;
}
.pp-inputtext:focus .p-inputicon  {
  display: block;
}


.p-iconfield .p-inputicon {
  color: #000;
  display: none;
}
*/
*,
*::before,
*::after {
  box-sizing: border-box;
}

</style>


