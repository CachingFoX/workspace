<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, onBeforeMount, onMounted, watchEffect, ref } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Card from 'primevue/card';
import { trackableService } from '@/di/trackables'
import ProgressSpinner from 'primevue/progressspinner';

const router = useRouter();
const route = useRoute();
const trackable = ref(null);
const progress = ref(false);

const props = defineProps({
  trackable: {
    type: [Object, String, Number],
    required: true,
    default: null
  },
  trackableOwner: {
    type: String,
    default: null
  },
  trackableIcon: {
    type: String,
    default: null
  },
  trackableNumber: {
    type: String,
    default: null
  },
});

watchEffect(async ()=> {
  progress.value = true;

  if (props.trackable) {
    if (typeof props.trackable == "object") {
      trackable.value = props.trackable;
    } else if (typeof props.trackable == "string") {
      trackable.value = await trackableService.getTrackableByNumber(props.trackable);
    } else if (typeof props.trackable == "Number") {
      console.warn("TrackableCard: internal id as reference currently not supported");
      // TODO
    } else {
      console.warn("TrackableCard: type of props is unknown:", typeof props.trackable)
    }
  } else {
    trackable.value = null;
    console.warn("TrackableCard: prop trackable is null");
  }

  progress.value = false;
});

function makeImageUrl(image_filename) {
  return 'http://localhost:8000/images/'+image_filename
}

function goToTrackable(tracking_code) {
  router.push("/trackable/"+tracking_code)
}

function goToOwner(owner) {
  // TODO router.push("/trackables/owner/"+owner)
}

const item = computed(() => trackable.value);

const okay = computed(() => trackable.value?true:false);

const title = computed(() => {
  return trackable.value ? trackable.value.title : "<unknown>";
});

const series = computed(() => {
  return trackable.value ? trackable.value.series : "<unknown>";
});

const main_image = computed(()=>{
  return trackable.value?.images.length > 0 ? makeImageUrl(trackable.value.images[0].filename) : null
})
const icon = computed(()=>{
  return trackable.value?.icon_url ? trackable.value.icon_url : ""
})

const active = computed(()=>{
  return trackable.value ? true : false
})

</script>

<template>
  <Card class="mx-2 my-2 trackable-card" @click.stop="goToTrackable(item.public_code)">
    <template #header>
      <div class="mx-3 mt-3" style="position: relative; aspect-ratio: 1 / 1;">
        <template v-if="trackable">

          <Tag v-if="props.trackableOwner"
            class="trackable-card-corner-overlay m-1"
            :class="`trackable-card-${props.trackableOwner}`"
            :value="trackable.owner ? trackable.owner : 'not activated'"
            :icon="trackable.owner ? 'pi pi-user' : 'pi pi-times'"
            :severity="trackable.owner ? 'info' : 'secondary'"
            :style="{ cursor: item.owner ? 'pointer' : 'default'}"
            @click.stop="item.owner ? goToOwner(item.owner) : void(0)"
          />

          <Tag v-if="props.trackableNumber"
            class="trackable-card-corner-overlay m-1"
            :class="`trackable-card-${props.trackableNumber}`"
            :value="trackable.public_code"
            severity="info"
            @click.stop="item.owner ? goToOwner(item.owner) : void(0)"
          />
          <!--
          <Tag class="trackable-card-corner-overlay trackable-card-north-east m-1" :value="value_ne" :icon="icon_ne"/>
          <Tag class="trackable-card-corner-overlay trackable-card-south-west m-1" :value="value_sw" :icon="icon_sw"/>
          <Tag class="trackable-card-corner-overlay trackable-card-south-east m-1" :value="value_se" :icon="icon_se"/>
          -->
          <div v-if="props.trackableIcon && main_image" style="position: absolute;  z-index: 1000;" class="m-1"
            :class="`trackable-card-${props.trackableIcon}`">
              <img :src="icon" class="card"/>
          </div>
        </template>

        <div class="trackable-card-image w-full flex justify-content-center align-items-center">
          <ProgressSpinner v-if="progress"/>
          <img v-else-if="main_image" :src="main_image" class="card card-img"/>
          <img v-else-if="icon" :src="icon" class="card card-icon"/>
          <div v-else-if="!trackable" style="text-align: center">
            <i class="pi pi-exclamation-triangle mb-3" style="font-size: 48pt; font-weight: bold; color: red;" />
            <br/>
            <span style="font-size: 16pt; font-weight: normal; color: red;">No Trackable</span></div>
          <div v-else style="text-align: center">
            <i class="pi pi-image mb-3" style="font-size: 48pt; font-weight: bold; color: lightgray;" />
            <br/>
            <span style="font-size: 16pt; font-weight: normal; color: lightgray;">No Image</span>
          </div>
        </div>
      </div>
    </template>
    <template #title><div class="trackable-card-text">{{ title }}</div></template>
    <template #subtitle><div class="trackable-card-text">{{ series }}</div></template>
    <!--
    <template #footer>
      <div class="flex gap-1 mt-1">
        <Button label="Details" class="w-full" @click="goToTrackable(item.public_code)" :disabled="!active"/>
        <Button icon="pi pi-tag" class="px-3" @click="goToTrackable(item.public_code)" :disabled="!active"/>
      </div>
    </template>
    -->
  </Card>
</template>

<style scoped>
.trackable-card {
  overflow: hidden;
  width: 256px;
  cursor: pointer;
}
.trackable-card:hover {
  background-color: lightblue;
}
.trackable-card-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  width: 100%;
}

.trackable-card-corner-overlay {
  position: absolute;
  z-index: 1000;
}
.trackable-card-north-west {
  top: 0;
  left: 0;
}
.trackable-card-north-east {
  top: 0;
  right: 0;
}
.trackable-card-south-west {
  bottom: 0;
  left: 0;
}
.trackable-card-south-east {
  bottom: 0;
  right: 0;
}

/* cards */

.card {
  aspect-ratio: 1 / 1;   /* Höhe = Breite */
  object-fit: cover;     /* füllt komplett, schneidet ggf. */
  object-position: center;
  display: block;
  margin: auto;          /* zentriert im div */
  border-radius: 8px;
}

.trackable-card-image {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 1 / 1;
  border: 1px solid #eee;
  border-radius: 8px;
}

.card-img {
  width: 100%;
}
.card-icon {
  width: 33%;
  min-width: 32px;
}
</style>
