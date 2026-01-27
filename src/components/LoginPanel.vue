<script setup>
import 'primeflex/primeflex.css';
import { ref, watch, computed } from 'vue'
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Password from 'primevue/password';
import Panel from 'primevue/panel';
import Message from 'primevue/message';
import FloatLabel from 'primevue/floatlabel';
import { useRouter, useRoute } from 'vue-router';
import { useBaseStore } from '../stores/base.js'

const storeBase = useBaseStore();
const router = useRouter();
const route = useRoute();

const username = ref('')
const password = ref('')

function login() {
  storeBase.login(username.value, password.value);
}

watch(
  () => storeBase.isLoggedIn,
  (newVal, oldVal) => {
    if (oldVal == false && newVal == true ) {
      const refer = route.query.refer;
      if (refer) {
        router.push(refer);
      } else {
        router.push("/dashboard")
      }
    }
  }
)
</script>

<template>
  <Panel header="Login"style="width: 400px;">
    <FloatLabel variant="in" class="mt-3 mb-3">
      <IconField>
        <InputIcon class="pi pi-user" />
        <InputText fluid v-model="username" inputId="username"/>
      </IconField>
      <label for="username">Username</label>
    </FloatLabel>

    <FloatLabel variant="in">
      <IconField>
          <InputIcon class="pi pi-key" />
          <Password fluid v-model="password" :feedback="false" toggleMask inputId="password"/>
      </IconField>
      <label for="password">Password</label>
    </FloatLabel>

    <Message class="mt-3" v-show="storeBase.loginError.length" severity="error" variant="simple">Login failed</Message>

    <div class="flex justify-content-end mt-4">
      <Button label="Login" @click="login" :disabled="!(username.length && password.length)"/>
    </div>
  </Panel>
</template>
