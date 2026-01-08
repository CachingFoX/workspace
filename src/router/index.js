import { createRouter, createWebHistory } from 'vue-router';
import List from '../views/list.vue';
// import About from '../views/About.vue';
import NewTrackable from '../NewTrackable.vue'; // ../views/...
import TrackableDetails from '../views/TrackableDetails.vue';

const routes = [
  {
    path: '/',
    name: 'List',
    component: List
  },
  {
    path: '/new',
    name: 'About',
    component: NewTrackable
  },
  {
    path: '/trackable/:id',  // :id ist der Parameter
    name: 'Trackable Details',
    component: TrackableDetails
  }
];

const router = createRouter({
  history: createWebHistory(), // nutzt die HTML5-History-API (schöne URLs ohne #)
  routes
});

export default router;
