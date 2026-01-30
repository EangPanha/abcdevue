import { reactive, computed } from 'vue';

// src/store/index.js

const state = reactive({
    cart: [],
    wishlist: [],
    compare: [], 
    activeSidebar: null,
    currency: 'USD',
    language: localStorage.getItem('appLanguage') || 'en',
    showCheckout: false,
    invoice: null,
    shippingInfo: {},
    orderNumber: null,
    // User authentication state
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    authToken: localStorage.getItem('authToken') || null,
    isLoggedIn: !!localStorage.getItem('authToken')
    ,
    // UI flags
    showCompareLimitModal: false
});

// Function to fetch exchange rate dynamically from Google Finance
const fetchExchangeRate = async () => {
    try {
        state.loadingRate = true;
        // Use Open Exchange Rates API (free tier available)
        // Or use this alternative: fetch from a reliable currency API
        const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.rates && data.rates.KHR) {
            const rate = parseFloat(data.rates.KHR);
            if (!isNaN(rate) && rate > 0) {
                state.exchangeRate = parseFloat(rate.toFixed(2));
                localStorage.setItem('usdKhrRate', state.exchangeRate);
                localStorage.setItem('usdKhrRateLastUpdate', new Date().toISOString());
                console.log('USD-KHR Exchange rate updated:', state.exchangeRate);
                return state.exchangeRate;
            }
        }
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback to cached rate or default
        const cachedRate = localStorage.getItem('usdKhrRate');
        if (cachedRate) {
            state.exchangeRate = parseFloat(cachedRate);
            const lastUpdate = localStorage.getItem('usdKhrRateLastUpdate');
            console.log('Using cached rate:', state.exchangeRate, 'from', lastUpdate);
        }
    } finally {
        state.loadingRate = false;
    }
};

// Initialize exchange rate on store creation
fetchExchangeRate();
// Update rate every 30 minutes for dynamic changes
setInterval(fetchExchangeRate, 1800000);

// Function to apply language-specific fonts
const applyLanguageFont = (lang) => {
    const root = document.documentElement;
    const appElement = document.getElementById('app');
    const body = document.body;
    
    if (lang === 'km') {
        // Apply single Khmer OS font for Khmer language to avoid switching
        root.classList.add('khmer-language');
        if (appElement) appElement.classList.add('khmer-language');
        if (body) body.classList.add('khmer-language');
        document.body.style.fontFamily = "'Khmer OS', serif";
        
        // Reset icon fonts
        document.querySelectorAll('[class*="fa-"]').forEach(icon => {
            icon.style.fontFamily = "'Font Awesome 6 Free', 'Font Awesome 6 Brands' !important";
        });
        
        console.log('Applied Khmer OS font');
    } else {
        // Apply Roboto for English
        root.classList.remove('khmer-language');
        if (appElement) appElement.classList.remove('khmer-language');
        if (body) body.classList.remove('khmer-language');
        document.body.style.fontFamily = "'Roboto', sans-serif";
        
        // Reset icon fonts
        document.querySelectorAll('[class*="fa-"]').forEach(icon => {
            icon.style.fontFamily = "";
        });
        
        console.log('Applied Roboto font');
    }
};

// Apply font on initial load
applyLanguageFont(state.language);

const methods = {
    // Sidebar Controls
    openSidebar(type) { state.activeSidebar = type; },
    closeSidebar() { state.activeSidebar = null; },

    // --- User Authentication ---
    login(userData, token = null) {
        state.user = userData;
        state.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            state.authToken = token;
            localStorage.setItem('authToken', token);
        }
    },

    updateUser(userData) {
        state.user = userData;
        localStorage.setItem('user', JSON.stringify(userData));
    },

    logout() {
        state.user = null;
        state.isLoggedIn = false;
        state.authToken = null;
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    },

    // --- Language & Font Management ---
    setLanguage(lang) {
        state.language = lang;
        localStorage.setItem('appLanguage', lang);
        // Apply font based on language
        applyLanguageFont(lang);
    },

    // --- Currency & Exchange Rate ---
    setCurrency(code) {
        state.currency = code;
    },

    refreshExchangeRate() {
        return fetchExchangeRate();
    },

    // Global helper to format prices
    formatPrice(value) {
        if (!value) return state.currency === 'USD' ? '$0.00' : '0 ៛';

        if (state.currency === 'KHR') {
            // Convert to Riel
            const riel = Math.round(value * state.exchangeRate);
            // Format with commas (e.g., 12,300 ៛)
            return new Intl.NumberFormat('km-KH').format(riel) + ' ៛';
        } else {
            // Default USD
            return '$' + value.toFixed(2);
        }
    },

    // --- CART LOGIC ---
    addToCart(product) {
        const existingItem = state.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ ...product, quantity: 1 });
        }
    },

    increaseQty(item) { item.quantity++; },

    decreaseQty(item) {
        if (item.quantity > 1) { item.quantity--; }
    },

    removeFromCart(item) {
        state.cart = state.cart.filter(p => p.id !== item.id);
    },

    // --- WISHLIST LOGIC ---
    addToWishlist(product) {
        if (!state.wishlist.find(item => item.id === product.id)) {
            state.wishlist.push(product);
        }
    },

    removeFromWishlist(product) {
        state.wishlist = state.wishlist.filter(item => item.id !== product.id);
    },

    // --- COMPARE LOGIC ---
    addToCompare(product) {
        if (state.compare.length >= 3) {
            // show custom modal instead of browser alert
            state.showCompareLimitModal = true;
            return;
        }
        if (!state.compare.find(item => item.id === product.id)) {
            state.compare.push(product);
        }
    },

    removeFromCompare(product) {
        state.compare = state.compare.filter(item => item.id !== product.id);
    }
};

// Small UI helpers to control the compare-limit modal
methods.showCompareLimit = function() {
    state.showCompareLimitModal = true;
};

methods.hideCompareLimit = function() {
    state.showCompareLimitModal = false;
};

const getters = {
    cartCount: computed(() => state.cart.reduce((total, item) => total + item.quantity, 0)),
    activeSidebar: computed(() => state.activeSidebar),
    cartItems: computed(() => state.cart),
    wishlistItems: computed(() => state.wishlist),
    compareItems: computed(() => state.compare),
    compareCount: computed(() => state.compare.length),
    wishlistCount: computed(() => state.wishlist.length),
    currentCurrency: computed(() => state.currency),
    currentLanguage: computed(() => state.language),
    currencySymbol: computed(() => state.currency === 'USD' ? '$' : '៛'),
    authToken: computed(() => state.authToken),

    // --- 👇 ADD THIS NEW GETTER FOR GRAND TOTAL 👇 ---
    cartTotal: computed(() => {
        return state.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    })
};

export default { state, methods, getters };
