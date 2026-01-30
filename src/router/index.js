import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PromotionsView from '../views/PromotionsView.vue';
import NewArrivalsView from '../views/NewArrivalsView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import TopSellersView from '../views/TopSellersView.vue';
import AuthView from '../views/AuthView.vue'; // 👈 Import the single Auth View
import SearchResultsView from '../views/SearchResultsView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import ProfileView from '../views/ProfileView.vue';
import store from '../store/index.js';

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/promotions', name: 'promotions', component: PromotionsView },
    { path: '/new-arrivals', name: 'new-arrivals', component: NewArrivalsView },
    { path: '/categories', name: 'categories', component: CategoriesView },
    { path: '/top-sellers', name: 'top-sellers', component: TopSellersView },

    // Both paths load the SAME component
    { path: '/login', name: 'login', component: AuthView },
    { path: '/register', name: 'register', component: AuthView },
    { path: '/search', name: 'search', component: SearchResultsView },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !store.state.isLoggedIn) {
        return { name: 'login' };
    }
    return true;
});

export default router;
