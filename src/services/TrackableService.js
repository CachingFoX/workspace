
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

  const deleteTrackable = async (id) => {
    const response = await httpClient(`${baseUrl}/trackables/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // oder .json()
      throw new Error(`Failed to delete trackable (${response.status}): ${errorBody}`);
    }

    return;
  };

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

  const getTrackableByNumber = async (tracking_number) => {
    const response = await httpClient(`${baseUrl}/trackingnumber/${tracking_number}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trackable by tracking number (${response.status})`);
    }

    return response.json();
  };

  return {
    createTrackable,
    deleteTrackable,
    getAllTrackables,
    getTrackableByNumber,
  };
}



// ---------
export const TrackableService = {

  async _load(code) {
    try {
      const response = await fetch(
        `http://localhost:8000/trackables/${code}`
      )
      let result = {
        trackable: null,
        okay: false,
        status: 0,
      };

      if (response.status == 200) {
        result.trackable = await response.json();
        result.okay = true;
        result.status = response.status;
      }

      return result;
    } catch (err) {
      console.error(err);
    } finally {

    }
  },

  /*
      data.value = {};
      copyData = {};

      const response = await fetch()
      const result = await response.json()

      status_code.value = response.status;
      if (response.status == 200 ) {
        data.value = result;
        copyData = { ...result };
      } else if (response.status == 404 ) {
        data.value = {};
        copyData = {};
      } else {
        data.value = {};
        copyData = {};
        console.error(response);
      }

    } catch (err) {
      console.error(err);
      error.value = err
    } finally {
      isLoading.value = false
    }
  */

  getTrackable(code) {
    return Promise.resolve(this._load(code));
  },

  async _get_trackable_by_tracking_number(tracking_number) {
    try {
      const response = await fetch(
        `http://localhost:8000/trackingnumber/${tracking_number}`
      )
      let result = {
        trackable: null,
        okay: false,
        status: 0,
      };

      if (response.status == 200) {
        result.trackable = await response.json();
        result.okay = true;
        result.status = response.status;
      }

      return result;
    } catch (err) {
      console.error(err);
    } finally {

    }
  },

  getTrackableByTrackingNumber(tracking_number) {
    return Promise.resolve(this._get_trackable_by_tracking_number(tracking_number));
  }
};
