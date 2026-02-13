import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const STATE_NO_INIT = "NO_INIT";
export const STATE_LOADING = "LOADING";
export const STATE_UNKNOWN = "UNKNOWN";
export const STATE_READY = "READY";
export const STATE_FAIL = "FAIL";

export const createTrackableStore = (trackableService, trackablePropertiesService, trackableImagesService) => {
  return defineStore('trackable', () => {
    // --- State ---
    const _state = ref(STATE_NO_INIT);
    const _progress = ref(false)
    const _init_code = ref('');
    const _data = ref({});
    const _properties = ref([]);

    // --- Actions ---
    const loadTrackable = async (tracking_number) => {
      _state.value = STATE_NO_INIT;
      _init_code.value = tracking_number;
      _data.value = {};
      _properties.value = [];

      try {
        _progress.value = true;
        _state.value = STATE_LOADING;
        _data.value = await trackableService.getTrackableByNumber(tracking_number);
        _properties.value = await trackablePropertiesService.getTrackableProperties(trackable_id.value);
        _state.value = STATE_READY;
        _progress.value = false;
      } catch (error) {
        console.error("loadTrackable error", error);
        _state.value = STATE_FAIL;
        _progress.value = false;
      }
    };

    const updateTrackableFields = async (fields) => {
      Object.assign(_data.value, fields); // TODO in the future _data.properties ????
      try {
        _progress.value = true;
        await trackableService.updateTrackable(_data.value.id, fields);
        _progress.value = false;
      } catch (error) {
        _progress.value = false;
      }
    }

    const deleteTrackable = async () => {
      try {
        _progress.value = true;
        await trackableService.deleteTrackable(_data.value.id);
        _data.value = {}
        _state.value = STATE_NO_INIT
        _progress.value = false;
      } catch (error) {
        console.error(error);
      } finally {
        _progress.value = true;
      }
    }

    const attachTag = async (tagId) => {
      try {
        _progress.value = true;
        await trackableService.attachTag(_data.value.id, tagId); // this.id???
        _data.value.tags = await trackableService.readTags(_data.value.id);
        // TODO update tags list of trackable
      } catch (error) {
      } finally {
        _progress.value = false;
      }
    }

    const dettachTag = async (tagId) => {
      try {
        _progress.value = true;
        await trackableService.dettachTag(_data.value.id, tagId); // this.id???
        _data.value.tags = await trackableService.readTags(_data.value.id);
        // TODO update tags list of trackable
      } catch (error) {
      } finally {
        _progress.value = false;
      }
    }

    const attachProperty = async (property_id, value) => {
      try {
        _progress.value = true;
        await trackablePropertiesService.newTrackableProperty(trackable_id.value, property_id, value);

        // reload properties
        _properties.value = await trackablePropertiesService.getTrackableProperties(trackable_id.value);
      } catch (error) {
        console.error("updateProperty error", error);
      } finally {
        _progress.value = false;
      }
    }

    const updateProperty = async (trackable_property_id, value) => {
      try {
        _progress.value = true;
        await trackablePropertiesService.updateTrackableProperty(trackable_id.value, trackable_property_id, value);

        // reload properties
        _properties.value = await trackablePropertiesService.getTrackableProperties(trackable_id.value);
      } catch (error) {
        console.error("updateProperty error", error);
      } finally {
        _progress.value = false;
      }
    }

    const setPropertyByName = async (property_name, value) => {
      const property = getPropertyByName(property_name)
      if (!property) {
        throw Error(`setPropertyByName: Property ${property_name} is unknown.`)
      }

      if (property.id) {
        // the property already exists for this trackable
        updateProperty(property.id, value);
      } else {
        // the property not exists for this trackable
        attachProperty(property.property_id, value);
      }
    }

    const removePropertyByName = async (property_name, value) => {
      const property = getPropertyByName(property_name)
      if (!property) {
        throw Error(`setPropertyByName: Property ${property_name} is unknown.`)
      }
      deleteProperty(property.id);
    }

    const deleteProperty = async (trackable_property_id) => {
      try {
        _progress.value = true;
        await trackablePropertiesService.deleteTrackableProperty(trackable_id.value, trackable_property_id);

        // reload properties
        _properties.value = await trackablePropertiesService.getTrackableProperties(trackable_id.value);
      } catch (error) {
        console.error("updateProperty error", error);
      } finally {
        _progress.value = false;
      }
    }

    const getPropertyByName = (property_name) => {
      const property = _properties.value.find(p => p.property_name === property_name)
      return property;
    };

    const uploadImages = async () => {
      try {
        _progress.value = true;
        _data.value.images = await trackableImagesService.getTrackableImages(trackable_id.value);
      } catch (error) {
        console.error("updateProperty error", error);
      } finally {
        _progress.value = false;
      }
    }

    const deleteImage = async (trackable_image_id) => {
      try {
        _progress.value = true;
        await trackableImagesService.deleteTrackableImage(trackable_id.value, trackable_image_id);

        // reload properties
        _data.value.images = await trackableImagesService.getTrackableImages(trackable_id.value);
      } catch (error) {
        console.error("deleteImage error", error);
      } finally {
        _progress.value = false;
      }
    }

    const primaryImage = async (trackable_id) => {
      console.log(trackable_id);
    }

    // --- Getter ---
    const data = computed(() => _data.value);
    const state = computed(() => _state.value);
    const progress = computed(() => _progress.value);
    const properties = computed(() => _properties.value);


    const trackingNumber = computed(() => {
      let result = "";
      result = result || (_data.value.public_code ?? null);
      result = result || (_data.value.private_code ?? null);
      result = result || (_data.value.init_code ?? "n/a");
      return result
    });
    const activated = computed(() => _data.value.activated);
    const created = computed(() => _data.value.created);
    const icon = computed(() => {
      if (_data.value.icon_url === null) {
        return null;
      }
      if (_data.value.icon_url.startsWith("http")) {
        return _data.value.icon_url
      }
      return 'https://www.geocaching.com' + _data.value.icon_url;
    });
    const id = computed(() => {
      console.warn('⚠️ TrackableStore.id is deprecated - use TrackableStore.trackable_id')
      return _data.value.id
    });
    const trackable_id = computed(() => _data.value.id);
    const images = computed(() => _data.value.images);
    const name = computed(() => _data.value.title);
    const owner = computed(() => _data.value.owner);
    const private_code = computed(() => _data.value.private_code);
    const public_code = computed(() => _data.value.public_code);
    const series = computed(() => _data.value.series);
    const tags = computed(() => _data.value.tags);
    const updated = computed(() => _data.value.updated);
    const linked_trackables = computed(() => {
      const value = getPropertyByName('linkedTrackables');
      if (!value) {
        console.error("Property linkedTrackables is not available")
      }
      return value
    });
    const linked_trackables_tokenized = computed(() => {
      const value = getPropertyByName('linkedTrackables');
      if (!value) {
        console.error("Property linkedTrackables is not available")
      }

      if (!value || !value.property_value) {
        return []
      }
      let tokens = value.property_value.split(' ');
      if (tokens.length == 0) {
        return []
      }

      return tokens;
    });

    // --- Expose ---
    return {
      data,
      state,
      progress,

      // const fields
      activated,
      created,
      icon,
      id,
      trackable_id,
      images,
      name,
      owner,
      private_code,
      public_code,
      series,
      tags,
      updated,
      linked_trackables,
      linked_trackables_tokenized,
      properties,

      // methods
      loadTrackable,
      updateTrackableFields,
      deleteTrackable,

      //
      attachTag,
      dettachTag,

      attachProperty,
      updateProperty,
      deleteProperty,

      getPropertyByName,
      setPropertyByName,
      removePropertyByName,

      uploadImages,
      deleteImage,
      primaryImage,
      //refreshImages,
    };
  });
};


/*

const createNewTag = (tag_name) => {
  TagService.newTagForTrackableId(private_code, tag_name).then((result) => {
    // TODO update trackable tags
    tagStore.loadAllTags();
  });
};

const removeTag = (tag_id) => {
  console.log("removeTag", private_code, tag_id)
  TagService.removeTagForTrackableId(private_code, tag_id).then((result)=>{
    // update list of tags
    loadTrackableTags(private_code);
  });
}

const addTag = (tag_id) => {
  console.log("addTag", private_code, tag_id)
  TagService.setTagForTrackableId(private_code, tag_id).then((result) => {
    // update list of tags
    loadTrackableTags(private_code);
  });
}

const loadTrackableTags = (trackable_id) => {
  TagService.getTagsByTrackableId(trackable_id).then((result) => {
    trackable_tags.value = result;
  });
}

const sendUpdate = async () => {
  let r = diffDeep(data.value, copyData);
  console.log(copyData);
  console.log(r)

  try {
    const response = await fetch(`http://localhost:8000/trackables/${private_code}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"  // Wir senden JSON
      },
      body: JSON.stringify(r)  // JS-Objekt in JSON umwandeln
    });
    const result = await response.json();

    data.value = result;
    copyData = { ...result };
  } catch (err) {
    console.error(err);
    error.value = err
  } finally {
    isLoading.value = false
  }
};
*/

/*

export const useTrackableViewStore = defineStore('trackable-viewx', () => {
  const _route = useRoute()

  const trackable_data = ref({});
  const _state = ref(STATE_NO_INIT);

  function fetch(tracking_code) {
    _state.value = STATE_LOADING;
    trackable_data.value = {};

    try {
      TrackableService.getTrackableByTrackingNumber(tracking_code).then((result) => {
        if (result.okay) {
          trackable_data.value = result.trackable;
          // TODO tagStore.loadAllTags();
          // TODO loadTrackableTags(private_code);
          _state.value = STATE_READY;
        } else {
          _state.value = STATE_UNKNOWN;
        }
      });
    } catch (err) {
      console.error(err);
      _state.value = STATE_FAIL;
    } finally {
    }
  }


  function init() {
  }

  const trackable_reference_code = computed(() => '??????');
  const state = computed(() => _state.value);

  return {
    fetch,
    init,
    state,
    trackable_data,
    trackable_reference_code,
  }
});

*/
