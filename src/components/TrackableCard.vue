<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, onBeforeMount, onMounted } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Card from 'primevue/card';

const router = useRouter();
const route = useRoute()

const props = defineProps({
  trackable: {
    type: Object,
    required: true
  }
});

function makeIconUrl(icon_url) {
  if (icon_url === null) {
    return null;
  }
  if (icon_url.startsWith("http")) {
    return icon_url
  }
  return 'https://www.geocaching.com'+icon_url;
}

function makeImageUrl(image_filename) {
  return 'http://localhost:8000/images/'+image_filename
}

function goToTrackable(tracking_code) {
  router.push("/trackable/"+tracking_code)
}

function goToOwner(owner) {
  // TODO router.push("/trackables/owner/"+owner)
}

const item = computed(() => props.trackable);

const okay = computed(() => props.trackable?true:false);
</script>

<template>
  <Card v-if="!okay" style="width: 256px; overflow: hidden" class="mx-2 my-2">
    <template #header>
      Trackable not found
    </template>
  </Card>
  <Card v-else style="width: 256px; overflow: hidden" class="mx-2 my-2" :id="`trackable-item-${item?.id}`" >
    <template #header>
      <div class="px-3 pt-3">
        <div style="position: relative; aspect-ratio: 1 / 1;" class="p-3">

          <div style="position: absolute; bottom: 0; right: 0; z-index: 1000;">
            <Tag
              :style="{ cursor: item.owner ? 'pointer' : 'default'}"
              :class="{ 'user-tag': item.owner }"
              :icon="item.owner ? 'pi pi-user' : 'pi pi-times'"
              :severity="item.owner ? 'info' : 'secondary'"
              :value="item.owner ? item.owner : 'not activated'"
              class="m-1"
              style="border: 1px solid var(--p-surface-300);"
              @click.stop="item.owner ? goToOwner(item.owner) : void(0)"></Tag>
          </div>

          <div style="position: absolute; top: 0; left: 0; z-index: 1000;" class="pt-1 pl-1" v-if="item.images.length ">
              <img :src="makeIconUrl(item.icon_url)" class="card"/>
          </div>

          <!--
          <div style="position: absolute; bottom: 0; left: 0; z-index: 1000;">
            <Tag
              severity="primary"
              :value="item.private_code"
              class="m-1"
              style="border: 1px solid var(--p-surface-300);"
              @click.stop="item.owner ? goToOwner(item.owner) : void(0)"></Tag>
          </div>

          <div style="position: absolute; bottom: 0; right: 0; z-index: 1000;">
            <Tag
              severity="primary"
              :value="item.public_code"
              class="m-1"
              style="border: 1px solid var(--p-surface-300);"
              @click.stop="item.owner ? goToOwner(item.owner) : void(0)"></Tag>
          </div>
        -->
          <div class="card-image-container border w-full flex justify-content-center align-items-center">
            <img
              :src="item.images.length ? makeImageUrl(item.images[0]?.filename) : makeIconUrl(item.icon_url)"
              class="card"
              :class="{ 'card-img': item.images.length, 'card-icon': !item.images.length }"
            />
          </div>
        </div>
      </div>
    </template>
    <template #title><div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;  max-width: 100%; width: 100%;">{{ item.title }}</div></template>
    <template #subtitle><div style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;  max-width: 100%; width: 100%;">{{ item.series }}</div>
    </template>
    <template #contentx>
        <p class="m-0">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
    </template>
    <template #footer>
        <div class="flex gap-1 mt-1">

            <Button label="Details" class="w-full" @click="goToTrackable(item.public_code)"/>
            <Button icon="pi pi-tag" class="px-3" @click="goToTrackable(item.public_code)"/>
            <!-- <Button v-if="item.owner" icon="pi pi-user" class="px-3" @click="goToTrackable(item.public_code)"/>-->
        </div>
    </template>
  </Card>
</template>

<style scoped>
.trackable-list-item-title {
}
.trackable-list-item-subtitle {
}
.p-divider {
  margin: 0.25rem 0; /* oben und unten 2rem */
}

/* vertical divider */
.p-divider-vertical {
  margin: 0 0rem; /* links und rechts 1rem */
}

.trackable-list-item {
}
.trackable-list-item:hover {
  background-color: lightblue;
}
.clickable {
  cursor: pointer;
}
.user-tag:hover {
  background-color: #ccc;
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

.card-image-container {
  position: absolute;
  top: 0;
  left: 0;
  aspect-ratio: 1 / 1;
}

.card-image-container.border {
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
