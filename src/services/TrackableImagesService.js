/* service methods are state-less */
import { createBaseService } from './BaseService.js';


export function createTrackableImagesService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "TrackableImagesService";

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

  const getTrackableImages = async (trackable_id) => {
    try {
      const response = await httpClient(`${baseUrl}/trackables/${trackable_id}/images`, {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        fnError(_name, `Read images from trackable ${trackable_id} fails`, response)
      } else {
        return response.json();
      }
    } catch (err) {
      throw err;
    }
  };

  const getURLuploadTrackableImages = (trackable_id) => {
    return `${baseUrl}/trackables/${trackable_id}/images`
  };

  /*
  const newTrackableProperty = async (trackable_id, property_id, value) => {
    try {
      const response = await httpClient(`${baseUrl}/trackables/${trackable_id}/properties`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          "property_id": property_id,
          "property_value": value,
        }),
      });

      if (!response.ok) {
        fnError(_name, `Create property ${property_id} of trackable ${trackable_id} fails`, response)
      } else {
        return response.json();
      }
    } catch (err) {
      throw err;
    }
  };

  const updateTrackableProperty = async (trackable_id, trackable_property_id, value) => {
    try {
      const response = await httpClient(`${baseUrl}/trackables/${trackable_id}/properties/${trackable_property_id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          "property_value": value,
        }),
      });

      if (!response.ok) {
        fnError(_name, `Update trackable-property ${trackable_property_id} of trackable ${trackable_id} fails`, response)
      } else {
        return response.json();
      }
    } catch (err) {
      throw err;
    }
  };
  */
  // deleteTrackableImage(id.value, trackable_image_id);

  const deleteTrackableImage = async (trackable_id, trackable_image_id) => {
    try {
      const response = await httpClient(`${baseUrl}/trackables/${trackable_id}/images/${trackable_image_id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        fnError(_name, `Delete image ${trackable_image_id} of trackable ${trackable_id} fails`, response)
      } else {
        return;
      }
    } catch (err) {
      throw err;
    }
  };


  return {
    registerErrorNotification,
    // crud trackable
    getTrackableImages,
    getURLuploadTrackableImages,
    // newTrackableProperty,
    // updateTrackableImage,
    deleteTrackableImage,
  };
}




