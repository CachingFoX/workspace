import { createTrackableService } from '@/services/TrackableService';
import { createTrackableListStore } from '@/stores/trackableListStore';
import { createTrackableStore } from '@/stores/trackableStore';
import { defaultAPIConfiguration } from '@/services/services'
const baseUrl = 'http://localhost:8000'

// --- Service ---
export const trackableService = createTrackableService(defaultAPIConfiguration);

// --- Stores ---
export const useTrackableListStore = createTrackableListStore(trackableService);
export const useTrackableStore = createTrackableStore(trackableService);

