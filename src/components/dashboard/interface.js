import { computed, ref, defineEmits } from 'vue'
// const emit = defineEmits()

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
    set(newValue) {
      // note - wird nicht aufgerufen
      console.log("useSafeModel.set", newValue)
      local.value = newValue
      if (model.value !== undefined) {
        emit(`update:${modelName}`, newValue)
      }
    }
  })
}

export function defineModelGetterSetter(model, modelName, defaultValue, emit) {
  const local = ref(defaultValue);
  return computed({
    get() {
      return model.value ?? local.value
    },
    set(newValue) {
      console.log("set", newValue)
      local.value = newValue;
      if (model.value !== undefined) {
        emit(`update:${modelName}`, newValue)
      }
    }
  })
}

export function defineSafeGetterSetterXX(model, local, member, defaultValue) {
  return computed({
    get() {
      return model.value ?? localCollapsed.value
    },
    set(newValue) {
      safeModel.value[member] = newValue;
    }
  })
}



