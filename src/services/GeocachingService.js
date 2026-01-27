export function createGeocachingService({
  baseUrl,
  httpClient,
  tokenProvider,
}) {
  const getHeaders = () => {
    const token = tokenProvider?.();

    return {
      Accept: 'application/json', // expect json
      'Content-Type': "application/json",  // send json
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const getTrackableData = async (tracking_code) => {
    const response = await httpClient(`${baseUrl}/trackables/geocaching/${encodeURIComponent(tracking_code)}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch trackable data (${response.status}): ${errorBody}`);
    }

    return response.json();
  };

  return {
    getTrackableData,
  };
}
