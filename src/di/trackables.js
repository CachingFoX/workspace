import { createCommonService } from '@/services/CommonService';
import { createBaseStore } from '@/stores/BaseStore.js';
import { createTagService } from '@/services/TagService';
import { createTrackableService } from '@/services/TrackableService';
import { createTrackablePropertiesService } from '@/services/TrackablePropertiesService';
import { createTrackableImagesService } from '@/services/TrackableImagesService';
import { createTokenService } from '@/services/TokenService';
import { createOwnerService } from '@/services/OwnerService';
import { createSeriesService } from '@/services/SeriesService';
import { createTagsStore } from '@/stores/tags.js';
import { createTrackableStore } from '@/stores/trackableStore';
import { createTrackableListStore } from '@/stores/trackableListStore';
import { createTokenStore } from '@/stores/TokenStore';
import { defaultAPIConfiguration } from '@/di/services'

// --- Service ---
export const commonService = createCommonService(defaultAPIConfiguration);
export const tagService = createTagService(defaultAPIConfiguration);
export const tokenService = createTokenService(defaultAPIConfiguration);
export const trackableService = createTrackableService(defaultAPIConfiguration);
export const trackablePropertiesService = createTrackablePropertiesService(defaultAPIConfiguration);
export const trackableImagesService = createTrackableImagesService(defaultAPIConfiguration);
export const ownerService = createOwnerService(defaultAPIConfiguration);
export const seriesService = createSeriesService(defaultAPIConfiguration);

// --- Stores ---
export const useBaseStore = createBaseStore(commonService);
export const useTagsStore = createTagsStore(tagService);
export const useTokenStore = createTokenStore(tokenService);
export const useTrackableListStore = createTrackableListStore(trackableService);
export const useTrackableStore = createTrackableStore(trackableService, trackablePropertiesService, trackableImagesService);

// TODO Geocaching Store and Service
