export function fromURLSearchParams(key, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key) || defaultValue;
  if (typeof defaultValue === 'boolean' && typeof value === 'string') {
    return value === '1' || value === 'true';
  }
  if (typeof defaultValue === 'string') {
    return value;
  }
  if (Array.isArray(defaultValue) && typeof value === 'string') {
    return value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
  if (Array.isArray(defaultValue) && Array.isArray(value)) {
    return value;
  }
  console.error("Invalid type/value for URL parameter", key, ":", typeof value, typeof defaultValue);
  return value
}

export function toURLSearchParameter(key, value) {
  const params = new URLSearchParams(window.location.search);
  if (value === undefined) {
    params.delete(key);
  } else if (Array.isArray(value) && value.length == 0) {
    params.delete(key);
  } else if (Array.isArray(value) && value.length > 0) {
    params.set(key, value.join(','));
  } else if (typeof value === 'string' && value.trim() !== '') {
    params.set(key, value.trim());
  } else if (typeof value === 'string' && value.trim() === '') {
    params.delete(key);
  } else if (typeof value === 'boolean') {
    params.set(key, value ? '1' : '0');
  } else {
    console.error("Invalid type/value for URL parameter:", typeof value, value);
    params.delete(key);
  }

  const newUrl =
    window.location.pathname +
    (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState({}, '', newUrl);
}

