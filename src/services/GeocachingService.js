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

  // links to geocaching.com
  function getLinkGeocachingTrackable(tracking_number) {
    return `https://www.geocaching.com/track/details.aspx?tracker=${tracking_number}`;
  }
  function getLinkGeocachingTrackableActivation(tracking_number, activation_code) {
    return `https://www.geocaching.com/track/Activate.aspx?trknum=${tracking_number}&activationCode=${activation_code}`;
  }
  function getLinkGeocachingUserProfile(username) {
    return `https://www.geocaching.com/p/default.aspx?u=${username}`;
  }
  function openNewTab(url) {
    window.open(url, '_blank');
  }

  return {
    getTrackableData,
    getLinkGeocachingTrackable,
    getLinkGeocachingTrackableActivation,
    getLinkGeocachingUserProfile,
    openNewTab,
  };
}
