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

  const readTrackableImages = async (trackable_id) => {
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

  function estimateCurrentFile(formData, loadedBytes) {
    // Schritt 1: File-Objekte aus FormData sammeln
    const files = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    // Schritt 2: kumulative Größen prüfen
    let cumulative = 0;
    for (const file of files) {
      cumulative += file.size;
      if (loadedBytes <= cumulative) {
        return file.name;
      }
    }

    // fallback
    return files.length ? files[files.length - 1].name : null;
  }

  const createTrackableImages = async (trackable_id, formData, callbackProgress) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${baseUrl}/trackables/${trackable_id}/images/`);

      // Upload-Progress Event
      xhr.upload.onprogress = (event) => {

        if (event.lengthComputable && callbackProgress) {
          const percent = parseFloat(((event.loaded / event.total) * 100).toFixed(2));
          const currentFile = estimateCurrentFile(formData, event.loaded);
          callbackProgress(percent, currentFile);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(
            fnError(_name, `Upload image at trackable ${trackable_id} fails`, xhr.status, xhr.responseText)
            // new Error(`HTTP error! Status: ${xhr.status}`)
          );
        }
      };

      xhr.onerror = () => {
        fnError(_name, `Upload image at trackable ${trackable_id} fails`, xhr.status, xhr.responseText)
        // reject(new Error('Upload fehlgeschlagen')
      }

      // TODO set header getHeaders()
      xhr.send(formData);
    });
  };

  const updateTrackableImage = async (trackable_id, trackable_image_id) => {
    console.error("not implemented")
  };

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
    createTrackableImages,
    readTrackableImages,
    updateTrackableImage,
    deleteTrackableImage,
  };
}







