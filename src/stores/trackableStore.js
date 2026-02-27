import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateKeyBetween } from 'fractional-indexing';

export const STATE_NO_INIT = "NO_INIT";
export const STATE_LOADING_DB = "LOADING_DB";
export const STATE_LOADING_HQ = "LOADING_HQ";
export const STATE_UNKNOWN = "UNKNOWN";
export const STATE_UNKNOWN_DB = "UNKNOWN_DB";
export const STATE_UNKNOWN_HQ = "UNKNOWN_HQ";
export const STATE_READY = "READY";
export const STATE_FAIL = "FAIL";

export const createTrackableStore = (trackableService, trackablePropertiesService, trackableImagesService, geocachingService) => {
  return defineStore('trackable', () => {
    // --- State ---
    const _state = ref(STATE_NO_INIT);
    const _progress = ref(false)
    const _init_code = ref('');
    const _data = ref({});
    const _properties = ref([]);
    const _complete = ref(false)

    // --- Actions ---
    const $reset = () => {
      _state.value = STATE_NO_INIT;
      _progress.value = false;
      _init_code.value = '';
      _data.value = {};
      _properties.value = [];
      _complete.value = false;
    }

    const readTrackableHQ = async (tracking_number) => {
      $reset();

      try {
        _progress.value = true;
        _state.value = STATE_LOADING_HQ;
        const result = await geocachingService.getTrackableData(tracking_number);
        // TODO undefined => new state READLY UNKNOWN / NOT IN THE SYSTEM
        _data.value = result;
        console.log(result);
        // data.value = result;
        // TODO state
        _state.value = STATE_READY;
      } catch (error) {
        console.log(error);
      } finally {
        _progress.value = false;
      }
    }

    const createTrackable = async () => {
      try {
        _progress.value = true;
        const result = await trackableService.createTrackable(data.value);
        console.log("TrackableStore.createTrackable", result)
        _data.value = result; // TODO if result is undefined
        _complete.value = true;
        _state.value = STATE_READY;
      } catch (error) {
        console.error("createTrackable error", error);
        _state.value = STATE_FAIL;
        _progress.value = false;
      } finally {
        _progress.value = false;
      }
    }

    const readTrackable = async (tracking_number) => {
      $reset()
      _init_code.value = tracking_number;

      try {
        _progress.value = true;
        _state.value = STATE_LOADING_DB;
        _data.value = await trackableService.getTrackableByNumber(tracking_number);
        if (_data.value !== undefined) {
          _properties.value = await trackablePropertiesService.getTrackableProperties(trackable_id.value);
          _complete.value = true;
          _state.value = STATE_READY;
        } else {
          _state.value = STATE_UNKNOWN;
        }

      } catch (error) {
        console.error("readTrackable error", error);
        _state.value = STATE_FAIL;
        _progress.value = false;
      } finally {
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

    const uploadImages = async (formData, callbackProgress) => {
      try {
        _progress.value = true;
        await trackableImagesService.createTrackableImages(trackable_id.value, formData, callbackProgress)
        _data.value.images = await trackableImagesService.readTrackableImages(trackable_id.value);
      } catch (error) {
        console.error("uploadImages error", error);
      } finally {
        _progress.value = false;
      }
    }

    const deleteImage = async (trackable_image_id) => {
      try {
        _progress.value = true;
        await trackableImagesService.deleteTrackableImage(trackable_id.value, trackable_image_id);

        // reload properties
        _data.value.images = await trackableImagesService.readTrackableImages(trackable_id.value);
      } catch (error) {
        console.error("deleteImage error", error);
      } finally {
        _progress.value = false;
      }
    }

    // --- Getter ---
    const data = computed(() => _data.value);
    const state = computed(() => _state.value);
    const progress = computed(() => _progress.value);
    const complete = computed(() => _complete.value); // TODO obsolete
    const from_database = computed(() => _complete.value);

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
    const hq_trackable_id = computed(() => _data.value.tb_id);
    const images = computed(() => {
      if (!_data.value.images?.length) {
        return []
      }

      /* TODO this info must be stored in the database */
      let rank = null;
      _data.value.images.forEach((item) => {
        if (!item.rank) {
          rank = generateKeyBetween(rank, null)
          item.rank = rank
          // TODO mark rank as updated
        } else {
          rank = item.rank
        }
      })

      return _data.value.images.sort((a, b) => {
        if (!a?.rank || !b?.rank) { return true }
        return a.rank > b.rank
      })
    });

    /*

    */

    const name = computed(() => _data.value.title);
    const owner = computed(() => _data.value.owner);
    const private_code = computed(() => _data.value.private_code);
    const public_code = computed(() => _data.value.public_code);
    const series = computed(() => _data.value.series);
    const tags = computed(() => _data.value.tags ?? []);
    const updated = computed(() => _data.value.updated);

    // --- Expose ---
    return {
      data,
      state,
      progress,
      complete, // TODO obsolete
      from_database,

      // const fields
      activated,
      created,
      icon,
      id,
      trackable_id,
      hq_trackable_id,
      images,
      name,
      owner,
      private_code,
      public_code,
      series,
      tags,
      updated,
      properties,

      // methods
      $reset,
      readTrackableHQ,
      createTrackable,
      readTrackable,
      updateTrackableFields,
      deleteTrackable,

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
    };
  });
};
