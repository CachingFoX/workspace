/* service methods are state-less */

export function createTokenService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "TokenService";

  const registerErrorNotification = (fn) => {
    fnError = fn;
  }

  const getHeaders = () => {
    const token = tokenProvider?.();

    return {
      Accept: 'application/json',
      'Content-Type': "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  /* --- public service methods --- */
  const login = async (username, password) => {
    const response = await httpClient(`${baseUrl}/token`, {
      method: 'POST',
      headers: getHeaders(),
      body: new URLSearchParams({
        grant_type: '',
        username: username,
        password: password,
        scope: '',
        client_id: '',
        client_secret: ''
      })
    });

    if (!response.ok) {
      fnError(_name, `Login fails`, response)
    } else {
      return response.json();
    }
  };

  const logout = async () => {
    const response = await httpClient(`${baseUrl}/token`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Logout fails`, response)
    } else {
      return response.json();
    }
  }

  const verify = async () => {
    const response = await httpClient(`${baseUrl}/token`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Logout fails`, response)
    } else {
      return response.json()
    }
  }

  return {
    registerErrorNotification,
    // --- crud methods
    login,
    logout,
    verify,
  };
}
