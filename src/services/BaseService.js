export function createBaseService({ serviceName, baseUrl, httpClient, tokenProvider, _fnError }) {
  // interner Fehler-Callback
  let fnError = _fnError;

  const registerErrorNotification = (fn) => {
    fnError = fn;
  };

  const getHeaders = () => {
    const token = tokenProvider?.();
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  return {
    serviceName,
    registerErrorNotification,
    getHeaders,
    fnError,
  };
}
