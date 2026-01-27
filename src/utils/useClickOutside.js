// useClickOutside.js
import { onMounted, onBeforeUnmount } from 'vue';

export function useClickOutside(targetRef, callback) {
  if (!targetRef) return;

  const handler = (event) => {
    if (!targetRef.value) return;
    if (!targetRef.value.contains(event.target)) {
      callback(event);
    }
  };

  onMounted(() => {
    document.addEventListener('click', handler);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handler);
  });
}
