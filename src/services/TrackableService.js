/* service methods are state-less */

export function createTrackableService({
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

  /* --- public service methods --- */

  const createTrackable = async (data) => {
    const response = await httpClient(`${baseUrl}/trackables`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // oder .json()
      throw new Error(`Failed to add trackable (${response.status}): ${errorBody}`);
    }

    return response.json();
  };

  const readTrackable = async (trackable_id) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackable_id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // oder .json()
      throw new Error(`Read trackable ${trackable_id} fails: (${response.status}): ${errorBody}`);
    }

    return;
  };

  const updateTrackable = async (trackable_id, fields) => {
    const response = await httpClient(`${baseUrl}/trackables/${trackable_id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(fields)
    });

    if (!response.ok) {
      const errorBody = await response.text(); // oder .json()
      throw new Error(`Update field/s ${fields} of trackable ${trackable_id} fails: (${response.status}): ${errorBody}`);
    }

    return;
  };

  const deleteTrackable = async (trackable_id) => {
    const response = await httpClient(`${baseUrl}/trackables/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Delete trackable ${trackable_id} fails with status ${response.status}: ${errorBody}`);
    }

    return;
  };

  /* --- special methods --- */
  const getAllTrackables = async () => {
    const response = await httpClient(`${baseUrl}/trackables/`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trackables (${response.status})`);
    }

    return response.json();
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
      const errorBody = await response.text();
      throw new Error(`Failed to fetch trackable by tracking number (${response.status}): $(errorBody)`);
    }

    return response.json();
  };


  return {
    // crud trackable
    createTrackable,
    readTrackable,
    updateTrackable,
    deleteTrackable,
    // all trackables methods
    getAllTrackables,
    getAllTrackablesByOwner,
    getAllTrackablesBySeries,
    // special methods
    getTrackableByNumber,
  };
}




