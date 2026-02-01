import LogoutView from '@/views/LogoutView.vue';
import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

const KEY_PREFIX = "TRACKABLE_"
const KEY_BEARER_TOKEN = KEY_PREFIX + 'authToken';
const KEY_USERNAME = KEY_PREFIX + 'username';

// https://stackoverflow.com/questions/74072848/multiple-instance-of-pinia-store-possible-in-same-page-or-same-component

export const createTokenStore = (tokenService) => {
  return defineStore('token', () => {

    // --- State ---
    // TODO: on mount setzen bzw onMount aufrufen
    let _username = ref(localStorage.getItem(KEY_USERNAME) || null);
    let _bearer_token = ref(localStorage.getItem(KEY_BEARER_TOKEN) || null);

    // --- Actions ---
    const login = async () => {
      logout();
      try {
        const result = await tokenService.login();
        _bearer_token.value = result.access_token;
        localStorage.setItem(KEY_BEARER_TOKEN, _bearer_token.value);
        _username.value = username
        localStorage.setItem(KEY_USERNAME, username); // TODO do not store the user name, request it from the API with GET /token
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    const logout = async () => {
      logout()
      try {
        await tokenService.logout();
        _bearer_token.value = null;
        localStorage.removeItem(KEY_BEARER_TOKEN);
        _username.value = null
        localStorage.removeItem(KEY_USERNAME,);
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    const verify = async () => {
      try {
        const result = await tokenService.verify();
        return result;
      } catch (error) {
        console.error(error);
      } finally {
      }
    };

    // --- Getter ---
    const username = computed(() => {
      return (_username.value == null || _username.value == '') ? '?' : _username.value;
    })
    const username1stLetter = computed(() => {
      return (_username.value == null || _username.value == '') ? '?' : _username.value[0].toUpperCase();
    })
    const isLoggedIn = computed(() => {
      return !(_bearer_token.value == null || _bearer_token.value == '');
    })
    const bearer_token = computed(() => {
      return _bearer_token.value;
    })

    // --- Expose ---
    return {
      username,
      username1stLetter,
      isLoggedIn,
      bearer_token,

      // methods
      login,
      logout,
      verify,
    };
  });
};
