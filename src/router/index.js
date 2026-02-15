import { createRouter, createWebHistory } from 'vue-router';
import List from '../views/list.vue';
import { useBaseStore } from '../stores/base.js'
// import About from '../views/About.vue';
import NewTrackable from '../NewTrackable.vue'; // ../views/...
import TrackablesListView from '../views/TrackablesListView.vue';
import TrackableView from '../views/TrackableView.vue';
import TrackableNewView from '../views/TrackableNewView.vue';
import TrackableUnknownView from '../views/TrackableUnknownView.vue'
import TestView from '../views/TestView.vue';
import LoginView from '../views/LoginView.vue';
import LogoutView from '../views/LogoutView.vue';
import DashboardView from '../views/DashboardView.vue';
import MainView from '../views/MainView.vue';
import TagsAdministrationView from '@/views/TagsAdministrationView.vue';
import OwnerTrackablesView from '@/views/OwnerTrackablesView.vue';
import SeriesTrackablesView from '@/views/SeriesTrackablesView.vue';

const routes = [
  {
    path: '/',
    name: 'Root',
    component: DashboardView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { noAuthRequired: true }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/owner/:owner?',
    name: 'Owner Trackables',
    component: OwnerTrackablesView,
  },
  {
    path: '/series/:series',
    name: 'Series Trackables',
    component: SeriesTrackablesView,
  },
  {
    path: '/main',
    name: 'Main',
    component: MainView,
  },
  {
    path: '/tags',
    name: 'Tags Administration',
    component: TagsAdministrationView,
  },
  {
    path: '/trackables',
    name: 'Trackables',
    component: TrackablesListView
  },
  {
    path: '/trackable/new/:id?',
    name: 'NewTrackable',
    component: TrackableNewView
  },
  {
    path: '/trackable/unknown/:id',
    name: 'UnknownTrackable',
    component: TrackableUnknownView
  },
  {
    path: '/trackable/:id',
    name: 'Trackable Details',
    component: TrackableView
  },

  {
    path: '/test',
    name: 'Test',
    component: TestView
  },
];

const router = createRouter({
  history: createWebHistory(), // nutzt die HTML5-History-API (schöne URLs ohne #)
  routes
});

// Global Guard
router.beforeEach((to, from, next) => {
  const storeBase = useBaseStore();

  if (!to.meta.noAuthRequired && !storeBase.isLoggedIn) {
    // User ist nicht eingeloggt → Login-Seite mit Referenz weiterleiten
    console.info("user is not login")
    next({
      name: 'Login',
      query: { refer: to.fullPath }
    })
    // next();
  } else {
    next() // alles okay, weiter
  }
})


export default router;
