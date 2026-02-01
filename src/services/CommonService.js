/* service methods are state-less */

export function createCommonService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "CommonService";

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
  const getBaseInformation = async () => {
    const response = await httpClient(`${baseUrl}/`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Read base information fails`, response)
    } else {
      return response.json();
    }
  };

  return {
    registerErrorNotification,
    // --- crud methods
    getBaseInformation,
  };
}

