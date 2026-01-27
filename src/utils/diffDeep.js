export function diffDeep(a, b) {
  const result = {}

  const keys = new Set([...Object.keys(a), ...Object.keys(b)])

  for (const key of keys) {
    const valA = a[key]
    const valB = b[key]

    if (
      typeof valA === 'object' &&
      typeof valB === 'object' &&
      valA !== null &&
      valB !== null
    ) {
      const diff = diffDeep(valA, valB)
      if (Object.keys(diff).length > 0) {
        result[key] = diff
      }
    } else if (valA !== valB) {
      result[key] = valA
    }
  }

  return result
}
