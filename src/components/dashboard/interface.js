import { computed } from 'vue'

export function defineGetterSetter(safeModel, member, defaultValue) {
  return computed({
    get() { return safeModel.value?.[member] ? safeModel.value[member] : defaultValue },
    set(newValue) { safeModel.value[member] = newValue; }
  })
}

export function useSafeModel(model, local, modelName) {
  return computed({
    get() {
      console.log("useSafeModel.get()")
      return model.value ?? local.value
    },
    set(val) {
      // note - wird nicht aufgerufen
      console.log("set", val)
      local.value = val
      if (model.value !== undefined) {
        emit(`update:${modelName}`, val)
      }
    }
  })
}



