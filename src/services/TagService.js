let data = []; // TODO in den TagService verlagern

export const TagService = {

  async _load_tags() {
    let data = [];
    try {
      const response = await fetch(
        `http://localhost:8000/tags`
      )
      data = await response.json()
    } catch (err) {
      console.error(err);
    } finally {
      return data;
    }
  },

  getAllTags() {
    return Promise.resolve(this._load_tags());
  },

  async _load_tags_by_trackable_id(rackable_id) {
    let data = [];
    try {
      const response = await fetch(
        `http://localhost:8000/trackables/${rackable_id}/tags`
      )
      data = await response.json()

    } catch (err) {
      console.error(err);
    } finally {
      return data;
    }
  },

  getTagsByTrackableId(trackable_id) {
    return Promise.resolve(this._load_tags_by_trackable_id(trackable_id));
  },

  async _set_tag_for_trackable(trackable_id, tag_id) {
    let result = null;
    try {
      const response = await fetch(
        `http://localhost:8000/trackables/${trackable_id}/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"  // Wir senden JSON
          },
          body: JSON.stringify({
            "id": tag_id
          })
        }
      )
      result = await response.json()

    } catch (err) {
      console.error(err);
    } finally {
    }
    return result;
  },

  setTagForTrackableId(trackable_id, tag_id) {
    console.log("TagService.setTagForTrackableId(", trackable_id, ",", tag_id, ")")
    return Promise.resolve(this._set_tag_for_trackable(trackable_id, tag_id));
  },

  async _create_tag(name) {
    let result = null;
    try {
      const response = await fetch(
        `http://localhost:8000/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"  // Wir senden JSON
          },
          body: JSON.stringify({
            "name": name
          })
        }
      )
      result = await response.json()
      console.log(result);
    } catch (err) {
      console.error(err);
    } finally {
    }
    return result;
  },

  newTagForTrackableId(trackable_id, tag_name) {
    console.log("TagService.newTagForTrackableId(", trackable_id, ",", tag_name, ")")
    return Promise.resolve(this._create_tag(tag_name)).then((result) => {
      let tag_id = result.id;
      return Promise.resolve(this._set_tag_for_trackable(trackable_id, tag_id))
    });
  },

  async _remove_tag_for_trackable(trackable_id, tag_id) {
    let result = null;
    try {
      const response = await fetch(
        `http://localhost:8000/trackables/${trackable_id}/tags/${tag_id}`,
        {
          method: "DELETE",
        }
      )
      // console.log(response);
      result = response.status == 204 ? true : false;
      // result = await response.json()

    } catch (err) {
      console.error(err);
    } finally {
    }
    return result;
  },

  removeTagForTrackableId(trackable_id, tag_id) {
    console.log("TagService.removeTagForTrackableId(", trackable_id, ",", tag_id, ")")
    return Promise.resolve(this._remove_tag_for_trackable(trackable_id, tag_id));
  },

};
