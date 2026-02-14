/* service methods are state-less */

export function createOwnerService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "OwnerService";

  const registerErrorNotification = (fn) => {
    fnError = fn;
  }

  const getHeaders = () => {
    const token = tokenProvider?.();

    return {
      Accept: 'application/json', // expect json
      'Content-Type': "application/json",  // send json
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  /* --- public service methods --- */
  const get_all_owners = async () => {
    const response = await httpClient(`${baseUrl}/owners`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Failed to get a list of trackable owners`, response)
    } else {
      return response.json();
    }
  }

  return {
    registerErrorNotification,
    get_all_owners,
  };
}




