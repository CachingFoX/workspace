/* service methods are state-less */

export function createTrackableService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "TrackableService";

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

  const createTrackable = async (data) => {
    const response = await httpClient(`${baseUrl}/trackables`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      fnError(_name, `Failed to add trackable ${data.private_code}/${data.public_code}`, response)
    } else {
      return response.json();
    }
  };

  const readTrackable = async (trackable_id) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackable_id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Read trackable ${trackable_id} fails`, response)
    } else {
      return response.json();
    }
  };

  const updateTrackable = async (trackable_id, fields) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackable_id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(fields)
    });

    if (!response.ok) {
      fnError(_name, `Update field/s ${fields} of trackable ${trackable_id} fails`, response)
    } else {
      return response.json();
    }
  };

  const deleteTrackable = async (trackable_id) => {
    const response = await httpClient(`${baseUrl}/trackables/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Delete trackable ${trackable_id} fails`, response)
    } else {
      return response.json();
    }
  };

  // ---

  const attachTag = async (trackableId, tagId) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackableId}/tags`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        'id': tagId
      }),
    });

    if (!response.ok) {
      fnError(_name, `Failed to attach tag ${tagId} at trackable ${trackableId}`, response)
    } else {
      return response.json();
    }
  };

  const readTags = async (trackableId) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackableId}/tags`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Failed to read tags of trackable ${trackableId}`, response)
    } else {
      return response.json();
    }
  };

  const dettachTag = async (trackableId, tagId) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackableId}/tags/${tagId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Failed to dettach tag ${tagId} at trackable ${trackableId}`, response)
    } else {
      return;
    }
  };

  /* --- special methods --- */
  const getAllTrackables = async () => {
    const response = await httpClient(`${baseUrl}/trackables/`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Fetch trackables failed`, response)
    } else {
      return response.json();
    }
  };

  const getAllTrackablesByOwner = async (owner) => {
    return getAllTrackables();
  }

  const getAllTrackablesBySeries = async (series) => {
    return getAllTrackables();
  }


  const getTrackableByNumber = async (tracking_number) => {
    const response = await httpClient(`${baseUrl}/trackingnumber/${tracking_number}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Fetch trackable by tracking number fails`, response)
    } else {
      return response.json();
    }
  };


  return {
    registerErrorNotification,
    // crud trackable
    createTrackable,
    readTrackable,
    updateTrackable,
    deleteTrackable,
    // ---
    attachTag,
    readTags,
    dettachTag,
    // all trackables methods
    getAllTrackables,
    getAllTrackablesByOwner,
    getAllTrackablesBySeries,
    // special methods
    getTrackableByNumber,
  };
}




