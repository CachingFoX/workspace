import { ref, watch } from 'vue'

export function useLocalStorageRef(key, defaultValue, delay = 1000) {
  let timeoutId = null
  const data = ref(defaultValue)
  // Initialwert aus localStorage lesen
  let storedValue = localStorage.getItem(key)
  try {
    data.value = storedValue ? JSON.parse(storedValue) : defaultValue
  } catch (e) {
    console.warn('Fehler beim Lesen in localStorage key=', key, 'value=', storedValue, ':', e)
  }

  // Änderungen automatisch speichern
  watch(
    data,
    (newValue) => {
      // debounce
      if (timeoutId) clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (e) {
          console.warn('Fehler beim Lesen in localStorage key=', key, 'value=', newValue, ':', e)
        }
      }, delay)
    },
    { deep: true }
  )

  return data
}
