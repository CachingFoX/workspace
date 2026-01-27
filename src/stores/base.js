import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const KEY_PREFIX = "TRACKABLE_"
const KEY_AUTH_TOKEN = KEY_PREFIX + 'authToken';
const KEY_USERNAME = KEY_PREFIX + 'username';

// TODO store früh - vor dem router - initalisieren

export const useBaseStore = defineStore('base', () => {
  // TODO: on mount setzen bzw onMount aufrufen
  let _username = ref(localStorage.getItem(KEY_USERNAME) || null);
  let _bearer_token = ref(localStorage.getItem(KEY_AUTH_TOKEN) || null);
  const loginOk = ref(false)
  const loginError = ref('')

  async function _login(username, password) {
    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: '',
          username: username,
          password: password,
          scope: '',
          client_id: '',
          client_secret: ''
        })
      });

      const data = await response.json();

      if (response.status === 401) {
        return {
          success: false,
          data
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async function _send_logout() {
    // a logout without a token doesn't work
    if (_bearer_token.value == null) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8000/token',
        {
          method: 'DELETE',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${_bearer_token.value}`
          }
        }
      );

      // 204 = No Content → erfolgreich
      if (response.status === 204) {
        return { success: true };
      }

      // andere erfolgreiche Codes
      if (response.ok) {
        return { success: true, status: response.status };
      }

      // fachlicher Fehler
      return {
        success: false,
        status: response.status,
        message: await response.text()
      };

    } catch (error) {
      // technischer Fehler (Netzwerk, CORS, Server down)
      throw {
        success: false,
        reason: 'NETWORK_ERROR',
        error
      };
    }
  }

  const login = (username, password) => {
    loginError.value = "";

    logout();

    _login(username, password).then((response) => {
      console.log(response.success, response)
      if (response.success == false) {
        loginOk.value = false;
        loginError.value = response.data.detail;
      }
      // TODO print a messeage in case of fail
      _bearer_token.value = response.data.access_token;
      localStorage.setItem(KEY_AUTH_TOKEN, _bearer_token.value);
      _username.value = username
      localStorage.setItem(KEY_USERNAME, username); // TODO do not store the user name, request it from the API with GET /token

      // TODO send a signal login was successful
      // TODO deactivate spinner
    });
  }

  const logout = () => {
    _send_logout();
    _bearer_token.value = null;
    localStorage.removeItem(KEY_AUTH_TOKEN);
    // TODO send logout to API
  }

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

  return {
    bearer_token,
    isLoggedIn,
    login,
    logout,
    username,
    username1stLetter,
    loginError
  };
});
