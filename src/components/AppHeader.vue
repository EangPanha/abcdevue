<template>
    <header>
        <div class="top-bar">
            <div class="container flex-between">
                <div class="left-options">
                    <div class="dropdown">
                        <button class="drop-btn">
                            <img :src="currentLang === 'en' ? 'https://flagcdn.com/w20/gb.png' : 'https://flagcdn.com/w20/kh.png'"
                                class="flag-icon" />
                            {{ currentLang === 'en' ? $t('header.langEn') : $t('header.langKh') }}
                            <i class="fa-solid fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="#" @click.prevent="switchLang('en')">
                                <img src="https://flagcdn.com/w20/gb.png" class="flag-icon" /> {{ $t('header.langEn') }}
                            </a>
                            <a href="#" @click.prevent="switchLang('kh')">
                                <img src="https://flagcdn.com/w20/kh.png" class="flag-icon" /> {{ $t('header.langKh') }}
                            </a>
                        </div>
                    </div>

                    <div class="dropdown">
                        <button class="drop-btn">{{ currencyName }} {{ currencySymbol }} <i
                                class="fa-solid fa-chevron-down"></i></button>
                        <div class="dropdown-content">
                            <a href="#" @click.prevent="setCurrency('USD')">U.S. Dollar $</a>
                            <a href="#" @click.prevent="setCurrency('KHR')">Khmer Riel ៛</a>
                        </div>
                    </div>
                </div>

                <div class="right-options">
                    <template v-if="isLoggedIn">
                        <button class="avatar-button" @click="goToProfile" title="Profile">
                            <img v-if="avatarUrl" :src="avatarUrl" alt="Profile avatar" />
                            <span v-else>{{ initials }}</span>
                        </button>
                    </template>
                    <template v-else>
                        <router-link to="/login">{{ $t('header.login') }}</router-link>
                        <span class="divider">|</span>
                        <router-link to="/register">{{ $t('header.register') }}</router-link>
                    </template>
                </div>
            </div>
        </div>

        <div class="main-header">
            <div class="container flex-between">
                <div class="logo-area">
                    <router-link to="/" class="logo-link">
                        <img :src="logoImg" alt="MarketPlace Logo" class="logo-img" />
                        <h2>MarketPlace</h2>
                    </router-link>
                </div>

                <div class="search-bar">
                    <button class="category-btn"><i class="fa-solid fa-bars"></i></button>

                    <input type="text" v-model="searchQuery" @input="onSearchInput" @keyup.enter="handleSearch"
                        :placeholder="$t('header.searchPlaceholder')" autocomplete="off" />

                    <button class="search-btn" @click="handleSearch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>

                    <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-list">
                        <div v-for="item in suggestions" :key="item.id" class="suggestion-item"
                            @click="selectSuggestion(item)">
                            <img :src="item.image" alt="thumb" />
                            <div class="suggestion-info">
                                <span class="s-name">{{ item.name }}</span>
                                <span class="s-price">{{ item.price }}</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="header-actions">
                    <div class="action-item" @click="openSidebar('compare')">
                        <div class="icon-wrapper"><i class="fa-solid fa-rotate"></i><span class="badge">{{ compareCount
                                }}</span></div>
                        <span>{{ $t('header.compare') }}</span>
                    </div>
                    <div class="action-item" @click="openSidebar('wishlist')">
                        <div class="icon-wrapper"><i class="fa-regular fa-heart"></i><span class="badge">{{
                                wishlistCount }}</span></div>
                        <span>{{ $t('header.wishlist') }}</span>
                    </div>
                    <div class="action-item" @click="openSidebar('cart')">
                        <div class="icon-wrapper"><i class="fa-solid fa-cart-shopping"></i><span class="badge">{{
                                cartCount }}</span></div>
                        <span>{{ $t('header.cart') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <nav class="main-nav">
            <div class="container">
                <ul>
                    <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
                    <li><router-link to="/promotions">{{ $t('nav.promotions') }}</router-link></li>
                    <li><router-link to="/new-arrivals">{{ $t('nav.arrivals') }}</router-link></li>
                    <li><router-link to="/categories">{{ $t('nav.categories') }}</router-link></li>
                    <li><router-link to="/top-sellers">{{ $t('nav.sellers') }}</router-link></li>
                </ul>
            </div>
        </nav>

        <AppSidebar :isOpen="activeSidebar === 'cart'" :title="$t('sidebar.cartTitle')" :items="cartItems"
            @close="closeSidebar" @remove="removeFromCart" />
        <AppSidebar :isOpen="activeSidebar === 'wishlist'" :title="$t('sidebar.wishlistTitle')" :items="wishlistItems"
            @close="closeSidebar" @remove="removeFromWishlist" />
        <CompareModal :isOpen="activeSidebar === 'compare'" :items="compareItems"
            @close="closeSidebar" />
        <CheckoutModal :isOpen="showCheckout" @close="closeCheckout" />
        <InvoiceModal :isOpen="showInvoice" @close="closeInvoice" />
    </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import store from '../store/index.js';
import { API_BASE } from '../services/api.js';
import AppSidebar from './AppSidebar.vue';
import CompareModal from './CompareModal.vue';
import CheckoutModal from './CheckoutModal.vue';
import InvoiceModal from './InvoiceModalFixed.vue';
import logoImg from '@/assets/logo1.png';

const { locale } = useI18n();
const router = useRouter();

const showCheckout = computed(() => store.state.showCheckout);
const showInvoice = computed(() => store.state.activeModal === 'invoice');

const closeCheckout = () => {
  store.state.showCheckout = false;
};

const closeInvoice = () => {
  store.state.activeModal = null;
};// --- LIVE SEARCH LOGIC ---
const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);

const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-S.jpg`;

const searchDB = [
    { id: 1, name: 'Atomic Habits', price: '$18.00', image: getImg(14553185) },
    { id: 2, name: 'Harry Potter', price: '$20.00', image: getImg(8259300) },
    { id: 3, name: 'Deep Work', price: '$14.50', image: getImg(8259201) },
    { id: 4, name: 'Rich Dad Poor Dad', price: '$12.99', image: getImg(8375633) },
    { id: 5, name: 'Klen-ANTI Dandruff Shampoo', price: '$3.00', image: getImg(10584485) },
    { id: 6, name: 'Dragon Balm', price: '$1.50', image: getImg(8231856) },
    { id: 7, name: 'Pride and Prejudice', price: '$8.00', image: getImg(8259400) },
    { id: 8, name: 'L3D Bop Bags', price: '$3.59', image: getImg(8392888) },
    { id: 9, name: 'Clarissa Facial Wash', price: '$26.00', image: getImg(8422522) },
    { id: 10, name: 'The Great Gatsby', price: '$10.00', image: getImg(8259222) },
];

const onSearchInput = () => {
    const query = searchQuery.value.toLowerCase().trim();
    if (query.length > 0) {
        suggestions.value = searchDB.filter(item =>
            item.name.toLowerCase().includes(query)
        );
        showSuggestions.value = true;
    } else {
        suggestions.value = [];
        showSuggestions.value = false;
    }
};

const selectSuggestion = (item) => {
    searchQuery.value = item.name;
    showSuggestions.value = false;
    handleSearch();
};

const handleSearch = () => {
    showSuggestions.value = false;
    const query = searchQuery.value.trim();
    if (query) {
        router.push({ name: 'search', query: { q: query } });
    }
};
// -------------------------

// Store Logic
const cartCount = computed(() => store.getters.cartCount.value);
const wishlistCount = computed(() => store.getters.wishlistCount.value);
const compareCount = computed(() => store.getters.compareCount.value);
const cartItems = computed(() => store.getters.cartItems.value);
const wishlistItems = computed(() => store.getters.wishlistItems.value);
const compareItems = computed(() => store.getters.compareItems.value);
const activeSidebar = computed(() => store.getters.activeSidebar.value);
const currentLang = computed(() => locale.value);
const currencySymbol = computed(() => store.getters.currencySymbol.value);
const currencyName = computed(() => store.getters.currentCurrency.value === 'USD' ? 'U.S. Dollar' : 'Khmer Riel');
const isLoggedIn = computed(() => store.state.isLoggedIn);
const currentUser = computed(() => store.state.user);
const initials = computed(() => {
    const name = currentUser.value?.name || 'User';
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
});
const avatarUrl = computed(() => {
    const avatar = currentUser.value?.avatar;
    if (!avatar) return '';
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
    }
    if (avatar.startsWith('/uploads')) {
        const base = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : '';
        return `${base}${avatar}`;
    }
    return avatar;
});

const openSidebar = (type) => store.methods.openSidebar(type);
const closeSidebar = () => store.methods.closeSidebar();
const removeFromCart = (item) => store.methods.removeFromCart(item);
const removeFromWishlist = (item) => store.methods.removeFromWishlist(item);
const switchLang = (lang) => { 
    locale.value = lang;
    localStorage.setItem('locale', lang);
    // Apply font changes based on language
    store.methods.setLanguage(lang === 'kh' ? 'km' : 'en');
};
const setCurrency = (code) => { store.methods.setCurrency(code); };
const goToProfile = () => {
    router.push({ name: 'profile' });
};
</script>

<style scoped>
/* Top Bar */
.top-bar {
    background-color: white;
    border-bottom: 1px solid #eee;
    font-size: 13px;
    padding: 8px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-options {
    display: flex;
    gap: 20px;
}

.right-options a {
    text-decoration: none;
    color: #555;
    transition: 0.3s;
}

.right-options a:hover {
    color: #e6b34e;
}

.right-options {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar-button {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: #f1f1f1;
    border: 1px solid #e6b34e;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #333;
    cursor: pointer;
    padding: 0;
    overflow: hidden;
}

.avatar-button img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.divider {
    margin: 0 10px;
    color: #ddd;
}

/* Dropdowns */
.dropdown {
    position: relative;
    display: inline-block;
}

.drop-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #555;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.flag-icon {
    width: 16px;
    height: auto;
    border-radius: 2px;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 120px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border-radius: 4px;
    top: 100%;
    left: 0;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    color: black;
    padding: 8px 12px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
    color: #e6b34e;
}

/* Main Header */
.main-header {
    padding: 20px 0;
    background: white;
}

.logo-area {
    display: flex;
    align-items: center;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: inherit;
}

.logo-img {
    width: 100px;
    height: auto;
    object-fit: contain;
}

.logo-area h2 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #000;
}

/* --- SEARCH BAR CSS --- */
.search-bar {
    display: flex;
    flex: 1;
    max-width: 600px;
    margin: 0 40px;
    border: 2px solid #e6b34e;
    border-radius: 4px;
    position: relative;
}

.category-btn {
    background: #f8f8f8;
    border: none;
    padding: 0 15px;
    cursor: pointer;
    border-right: 1px solid #ddd;
}

.search-bar input {
    flex: 1;
    border: none;
    padding: 10px 15px;
    outline: none;
}

.search-btn {
    background: #e6b34e;
    color: white;
    border: none;
    padding: 0 25px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.3s;
}

.search-btn:hover {
    background: #d6a23e;
}

/* --- SUGGESTIONS DROPDOWN --- */
.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #eee;
    border-top: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 4px 4px;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.2s;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background-color: #f9f9f9;
}

.suggestion-item img {
    width: 30px;
    height: 40px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 2px;
}

.suggestion-info {
    display: flex;
    flex-direction: column;
}

.s-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.s-price {
    font-size: 12px;
    color: #e6b34e;
    font-weight: bold;
}

/* Actions */
.header-actions {
    display: flex;
    gap: 25px;
    align-items: center;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #555;
    font-size: 14px;
}

.action-item:hover {
    color: #e6b34e;
}

.icon-wrapper {
    position: relative;
    font-size: 20px;
}

.badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e6b34e;
    color: white;
    font-size: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Nav */
.main-nav {
    background: #333;
}

.main-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 30px;
}

.main-nav a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    font-size: 14px;
    padding: 15px 0;
    display: block;
    text-transform: uppercase;
    transition: 0.3s;
}

.main-nav a:hover,
.main-nav a.router-link-active {
    color: #e6b34e;
}
</style>
