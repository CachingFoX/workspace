import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useTrackableListStore, useTagsStore } from "@/di/trackables.js"
import { seriesService } from "@/di/trackables.js"

const sortItemsByLabel = (a, b) => { return a.label.localeCompare(b.label) }

export const ADVANCED_SEARCH_TYPES = {
  TRACKABLE: "trackable",
  TAG: "tag",
  SERIES: "series"
}

export const useAdvancedSearchStore = defineStore('advanced-search', () => {
  // --- State ---
  const router = useRouter();
  const route = useRoute();
  const storeTrackables = useTrackableListStore();
  const storeTags = useTagsStore();
  const seriesX = ref([])
  const _input = ref("")
  const _loading = ref(false)
  const _grouped = ref(true);
  const _types = ref(Object.values(ADVANCED_SEARCH_TYPES));
  let _updateURLSearchParameter = false;

  // --- Actions ---
  const $reset = () => {
  }

  function updateURLSearchParameterOn() {
    _updateURLSearchParameter = true;
  }
  function updateURLSearchParameterOff() {
    _updateURLSearchParameter = false;
  }

  // --- Getter ---
  const series = computed(() => {
    if (!types.value.includes(ADVANCED_SEARCH_TYPES.SERIES)) {
      return []
    }
    // TODO in einen eigene Store verschieben
    if (seriesX.value.length == 0) {
      seriesService.get_all_series().then((r) => {
        seriesX.value = r
        return r
      })
    }
    return seriesX.value
  });
  const tags = computed(() => { return types.value.includes(ADVANCED_SEARCH_TYPES.TAG) ? storeTags.tags : [] })
  const trackables = computed(() => { return types.value.includes(ADVANCED_SEARCH_TYPES.TRACKABLE) ? storeTrackables.trackables : [] });

  const numberOfItems = computed(() => {
    return trackables.value.length + tags.value.length + series.value.length
  })

  function updateURLSearchParameter(parameterName, newVal) {
    if (_updateURLSearchParameter) {
      const newQuery = { ...route.query }

      if (newVal?.length) {
        newQuery[parameterName] = newVal
      } else {
        delete newQuery[parameterName]   // entfernt das Attribut komplett
      }

      router.replace({ query: newQuery })
    }
  }

  function addItems(suggestions, grouped, groupLabel, newSuggestions) {
    if (newSuggestions?.length) {
      if (!grouped) {
        suggestions.push(...newSuggestions)
      } else {
        newSuggestions.sort(sortItemsByLabel);
        suggestions.push({
          label: groupLabel,
          code: groupLabel,
          items: [...newSuggestions]
        })
      }
    }
  }

  const suggestions = computed(() => {
    if (!_input.value?.trim().length) {
      console.log("no suggests");
      return []
    }

    // console.time("suggestions");

    _loading.value = true

    let queryLowerCase = _input.value.trim().toLowerCase()
    let queryUpperCase = _input.value.trim().toUpperCase()

    let suggestedItems = [];
    let results = [];

    // ------------

    addItems(suggestedItems, _grouped.value, 'Trackables', filteredTrackables.value.map((i) => {
      return { type: ADVANCED_SEARCH_TYPES.TRACKABLE, label: i.title, route: `/trackable/${i.public_code}`, data: i }
    }))

    // ------------

    results = tags.value.filter(t => {
      return t.name.toLowerCase().includes(queryLowerCase);
    })

    addItems(suggestedItems, _grouped.value, 'Tags', results.map((i) => {
      return { type: ADVANCED_SEARCH_TYPES.TAG, label: i.name, route: `/tag/${i.id}?label=${i.name}`, data: i }
    }))

    // ------------

    results = series.value.filter(s => {
      return s.series.toLowerCase().includes(queryLowerCase);
    })

    addItems(suggestedItems, _grouped.value, 'Series', results.map((i) => {
      return { type: ADVANCED_SEARCH_TYPES.SERIES, label: i.series, route: `/series/${i.series}`, data: i }
    }))

    // ----------

    if (!_grouped.value) {
      suggestedItems.sort(sortItemsByLabel);
    }

    _loading.value = false;

    // console.timeEnd("suggestions");
    return suggestedItems;
  });

  const loading = computed(() => _loading.vlaue)

  const grouped = computed({
    get: () => _grouped.value,
    set: (v) => { _grouped.value = v }
  })
  const types = computed({
    get: () => {
      return _types.value?.length ? _types.value : Object.values(ADVANCED_SEARCH_TYPES)
    },
    set: (v) => {
      _types.value = v
      updateURLSearchParameter("types", _types.value)
    }
  })



  const queryString = computed({
    get: () => _input.value,
    set: (v) => {
      _input.value = (v?.length ? v : "").trim()
      updateURLSearchParameter("query", _input.value)
    }
  })
  const queryStringUpperCase = computed(() => {
    return _input.value.trim().toUpperCase()
  })

  const queryStringLowerCase = computed(() => {
    return _input.value.trim().toLowerCase()
  })

  const numberOfSuggestions = computed(() => {
    if (!suggestions.value?.length) {
      return 0;
    }
    if (!_grouped.value) {
      return suggestions.value.length;
    }
    let number = 0;
    suggestions.value.forEach(group => {
      number += group.items.length
    });
    return number;
  });

  const isQueryStringTrackingNumber = computed(() => {
    if (typeof _input.value == 'string' && _input.value?.trim().length >= 6) {
      if (!queryStringUpperCase.value.includes(' ') && !queryStringUpperCase.value.startsWith('TB')) {
        return true;
      }
    }
    return false;
  })

  const filteredTrackables = computed(() => {
    let queryLowerCase = _input.value.trim().toLowerCase()
    let queryUpperCase = _input.value.trim().toUpperCase()
    return trackables.value.filter(i => {
      return i.title.toLowerCase().includes(queryLowerCase) ||
        i.series.toLowerCase().includes(queryLowerCase) ||
        i.private_code.startsWith(queryUpperCase) ||
        i.public_code.startsWith(queryUpperCase) ||
        i.tags.some(t => {
          return t.name.toLowerCase().includes(queryLowerCase)
        })
    })
  })

  // --- Expose ---
  return {
    // actions
    $reset,
    updateURLSearchParameterOff,
    updateURLSearchParameterOn,

    // getters
    series,
    tags,
    trackables,
    grouped,
    queryString,

    filteredTrackables,

    queryStringUpperCase,
    queryStringLowerCase,
    loading,
    types,

    suggestions,
    numberOfItems,
    numberOfSuggestions,
    isQueryStringTrackingNumber

  };
});

