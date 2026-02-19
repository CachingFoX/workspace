import { createCommonService } from '@/services/CommonService';
import { createGeocachingService } from '@/services/GeocachingService';
import { createOwnerService } from '@/services/OwnerService';
import { createSeriesService } from '@/services/SeriesService';
import { createTagService } from '@/services/TagService';
import { createTokenService } from '@/services/TokenService';
import { createTrackableImagesService } from '@/services/TrackableImagesService';
import { createTrackablePropertiesService } from '@/services/TrackablePropertiesService';
import { createTrackableService } from '@/services/TrackableService';

import { createBaseStore } from '@/stores/BaseStore.js';
import { createTagsStore } from '@/stores/tags.js';
import { createTokenStore } from '@/stores/TokenStore';
import { createTrackableListStore } from '@/stores/trackableListStore';
import { createTrackableStore } from '@/stores/trackableStore';

import { defaultAPIConfiguration } from '@/di/services'


// --- Service ---


// --- Service ---
export const commonService = createCommonService(defaultAPIConfiguration);
export const tagService = createTagService(defaultAPIConfiguration);
export const tokenService = createTokenService(defaultAPIConfiguration);
export const trackableService = createTrackableService(defaultAPIConfiguration);
export const trackablePropertiesService = createTrackablePropertiesService(defaultAPIConfiguration);
export const trackableImagesService = createTrackableImagesService(defaultAPIConfiguration);
export const ownerService = createOwnerService(defaultAPIConfiguration);
export const seriesService = createSeriesService(defaultAPIConfiguration);
export const geocachingService = createGeocachingService(defaultAPIConfiguration);

// --- Stores ---
export const useBaseStore = createBaseStore(commonService);
export const useTagsStore = createTagsStore(tagService);
export const useTokenStore = createTokenStore(tokenService);
export const useTrackableListStore = createTrackableListStore(trackableService);
export const useTrackableStore = createTrackableStore(trackableService, trackablePropertiesService, trackableImagesService, geocachingService);

// TODO Geocaching Store and Service
