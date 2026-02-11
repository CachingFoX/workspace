/* service methods are state-less */

export function createTagService({
  baseUrl,
  httpClient,
  tokenProvider,
  fnError,
}) {
  const _name = "TagService";

  const registerErrorNotification = (fn) => {
    fnError = fn;
  }

  const getHeaders = () => {
    const token = tokenProvider?.();

    return {
      Accept: 'application/json',
      'Content-Type': "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  /* --- public service methods --- */

  const create = async (tagName) => {
    const response = await httpClient(`${baseUrl}/tags/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        "name": tagName
      }),
    });

    if (!response.ok) {
      fnError(_name, `Create new tag ${tagName} fails`, response)
    } else {
      return response.json();
    }
  };

  const read = async (tagId) => {
    let urlTag = `${baseUrl}/tags/`
    if (tagId?.length) {
      urlTag += Tag + tagId;
    }
    const response = await httpClient(urlTag, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (tagId?.length) {
        fnError(_name, `Read tag ${tagId} fails`, response)
      } else {
        fnError(_name, `Read all tags fails`, response)
      }
    } else {
      return response.json();
    }
  };

  const read_with_use = async (tagId) => {
    let urlTag = `${baseUrl}/tags/`
    if (tagId?.length) {
      urlTag += Tag + tagId + "/";
    }

    const response = await httpClient(urlTag, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (tagId?.length) {
        fnError(_name, `Read tag ${tagId} fails`, response)
      } else {
        fnError(_name, `Read all tags fails`, response)
      }
    } else {
      return response.json();
    }
  };

  const update = async (tagId, newTagName) => {
    const response = await httpClient(`${baseUrl}/tags/${tagId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({
        "name": newTagName
      }),
    });

    if (!response.ok) {
      fnError(_name, `Update tag ${tagId} fails`, response)
    } else {
      return response.json();
    }
  };

  const _delete = async (tagId) => {
    const response = await httpClient(`${baseUrl}/tags/${tagId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      fnError(_name, `Delete tag ${tagId} fails`, response)
    } else {
      return;
    }
  };

  return {
    registerErrorNotification,
    // --- crud methods
    create,
    update,
    read,
    read_with_use,
    _delete,
  };
}

