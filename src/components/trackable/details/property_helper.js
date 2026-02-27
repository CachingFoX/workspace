

/* Converts a UTC date/time string to a local time stamp */
export function formatDateTime(timeString) {
  if (!timeString?.length) {
    return timeString
  }
  //
  const date = new Date(timeString + "Z");  // create an UTC string
  const datePart = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium"
  }).format(date);

  const timePart = new Intl.DateTimeFormat("de-DE", {
    timeStyle: "medium"
  }).format(date);
  return `${datePart} ${timePart}`;
}

export function makeRouteButton(visible, route, icon, label) {
  return { route: route, icon: icon, label: label, show: visible }
}

export function makeLinkButton(visible, link, icon, label) {
  return { link: link, icon: icon, label: label, show: visible }
}

