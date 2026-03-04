import { HTTP_STATUS_404_NOT_FOUND } from './httpstatus.js'

/* service methods are state-less */
export function createGeocachingService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "GeocachingService";

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

  const getTrackableMasterDataByTrackingNumber = async (trackingnumber) => {
    const response = await httpClient(`${baseUrl}/trackables/geocaching/${encodeURIComponent(trackingnumber)}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (response.ok) {
      return response.json();
    } else if (response.status == HTTP_STATUS_404_NOT_FOUND) {
      return null;
    } else {
      fnError(_name, `Fail to fetch trackable master data from www.geocaching.com by tracking number`, response)
    }
  };

  // links to geocaching.com
  function getLinkGeocachingTrackable(tracking_number) {
    return `https://www.geocaching.com/track/details.aspx?tracker=${tracking_number}`;
  }
  function getLinkGeocachingTrackableActivation(tracking_number, activation_code) {
    return `https://www.geocaching.com/track/Activate.aspx?trknum=${tracking_number}&activationCode=${activation_code}`;
  }
  function getLinkGeocachingTrackableById(tracking_number) {
    return `https://www.geocaching.com/track/details.aspx?id=${tracking_number}`
  }
  function getLinkGeocachingUserProfile(username) {
    username = encodeURIComponent(username).replace(/%20/g, '+'); // application/x-www-form-urlencoded
    return `https://www.geocaching.com/p/default.aspx?u=${username}`;
  }

  return {
    registerErrorNotification,

    getTrackableMasterDataByTrackingNumber,

    getLinkGeocachingTrackable,
    getLinkGeocachingTrackableActivation,
    getLinkGeocachingTrackableById,
    getLinkGeocachingUserProfile,
  };
}
